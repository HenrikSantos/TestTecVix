import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel";
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

export class UserService {
  private userModel = new UserModel();

  async getById(idUser: string) {
    const user = await this.userModel.getById(idUser);
    if (!user) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return user;
  }

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.userModel.listAll(validQuery);
  }

  async createUser(data: TUserCreated) {
    const validData = userCreatedSchema.parse(data);

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

  async updateUser(idUser: string, data: TUserUpdated) {
    const validData = userUpdatedSchema.parse(data);

    const existingUser = await this.userModel.getById(idUser);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
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

    const updateData: TUserUpdated & { password?: string } = { ...validData };

    if (validData.password) {
      updateData.password = await bcrypt.hash(validData.password, 10);
    }

    return this.userModel.updateUser(idUser, updateData);
  }

  async deleteUser(idUser: string) {
    const existingUser = await this.userModel.getById(idUser);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
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

    return {
      token,
      user: {
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        profileImgUrl: user.profileImgUrl,
        role: user.role,
        idBrandMaster: user.idBrandMaster,
        isActive: user.isActive,
        lastLoginDate: user.lastLoginDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
