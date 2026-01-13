import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel";
import { BrandMasterModel } from "../models/BrandMasterModel";
import {
  userCreatedSchema,
  TUserCreated,
} from "../types/validations/User/createUser";
import {
  userUpdatedSchema,
  TUserUpdated,
} from "../types/validations/User/updateUser";
import {
  loginUserSchema,
  TLoginUser,
} from "../types/validations/User/loginUser";
import { querySchema } from "../types/validations/Queries/queryListAll";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { genToken } from "../utils/jwt";
import { user } from "@prisma/client";

export class UserService {
  private userModel = new UserModel();

  async getById(idUser: string, user?: user) {
    const fetchedUser = await this.userModel.getById(idUser);
    if (!fetchedUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (
      user?.idBrandMaster &&
      fetchedUser.idBrandMaster !== user.idBrandMaster
    ) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    return fetchedUser;
  }

  async listAll(query: unknown, user?: user) {
    const validQuery = querySchema.parse(query);

    if (user?.idBrandMaster) {
      validQuery.idBrandMaster = user.idBrandMaster;
    }

    return this.userModel.listAll(validQuery);
  }

  async createUser(data: TUserCreated, user?: user) {
    if (user?.role === "member") {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    const validData = userCreatedSchema.parse(data);

    if (user?.idBrandMaster) {
      validData.idBrandMaster = user.idBrandMaster;
    }

    const existingEmail = await this.userModel.getByEmail(validData.email);
    if (existingEmail) {
      throw new AppError(
        ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    const existingUsername = await this.userModel.getByUsername(
      validData.username,
    );
    if (existingUsername) {
      throw new AppError(
        ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(validData.password, 10);

    const newUser = await this.userModel.createUser({
      ...validData,
      password: hashedPassword,
    });

    return newUser;
  }

  async updateUser(idUser: string, data: TUserUpdated, user?: user) {
    const existingUser = await this.userModel.getById(idUser);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const isSelf = user?.idUser === idUser;

    if (user?.role === "member" && !isSelf) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    const validData = userUpdatedSchema.parse(data);
    const updateData: TUserUpdated & { password?: string } = { ...validData };

    if (user && user.role !== "admin") {
      delete updateData.role;
      delete updateData.idBrandMaster;
      delete updateData.isActive;
    }

    if (user?.role === "admin" && user.idBrandMaster) {
      delete updateData.idBrandMaster;
    }

    if (
      user?.idBrandMaster &&
      existingUser.idBrandMaster !== user.idBrandMaster
    ) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    if (validData.email && validData.email !== existingUser.email) {
      const existingEmail = await this.userModel.getByEmail(validData.email);
      if (existingEmail) {
        throw new AppError(
          ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
          STATUS_CODE.CONFLICT,
        );
      }
    }

    if (validData.username && validData.username !== existingUser.username) {
      const existingUsername = await this.userModel.getByUsername(
        validData.username,
      );
      if (existingUsername) {
        throw new AppError(
          ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
          STATUS_CODE.CONFLICT,
        );
      }
    }

    if (validData.password) {
      updateData.password = await bcrypt.hash(validData.password, 10);
    }

    return this.userModel.updateUser(idUser, updateData);
  }

  async deleteUser(idUser: string, user?: user) {
    if (user?.role === "member" || user?.role === "manager") {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    const existingUser = await this.userModel.getById(idUser);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (
      user?.idBrandMaster &&
      existingUser.idBrandMaster !== user.idBrandMaster
    ) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    return this.userModel.deleteUser(idUser);
  }

  async login(data: TLoginUser) {
    const validData = loginUserSchema.parse(data);

    let user = null;

    if (validData.email) {
      user = await this.userModel.getByEmail(validData.email);
    }

    if (!user && validData.username) {
      user = await this.userModel.getByUsername(validData.username);
    }

    if (!user) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      validData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    await this.userModel.updateLastLogin(user.idUser);

    const token = genToken({
      idUser: user.idUser,
      email: user.email,
      role: user.role,
      idBrandMaster: user.idBrandMaster,
    });

    let brandMaster = null;
    if (user.idBrandMaster) {
      const brandMasterModel = new BrandMasterModel();
      brandMaster = await brandMasterModel.getById(user.idBrandMaster);
    }

    return {
      token,
      user: {
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        userPhoneNumber: user.userPhoneNumber,
        profileImgUrl: user.profileImgUrl,
        role: user.role,
        idBrandMaster: user.idBrandMaster,
        isActive: user.isActive,
        lastLoginDate: user.lastLoginDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      brandMaster: brandMaster
        ? {
            emailContact: brandMaster.emailContact,
            smsContact: brandMaster.smsContact,
            timezone: brandMaster.timezone,
          }
        : null,
    };
  }
}
