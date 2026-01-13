import { brandMaster, user } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BrandMasterModel } from "../models/BrandMasterModel";
import { UserModel } from "../models/UserModel";
import { querySchema } from "../types/validations/Queries/queryListAll";
import {
  brandMasterSchema,
  TBrandMaster,
} from "../types/validations/BrandMaster/createBrandMaster";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

export class BrandMasterService {
  constructor() {}
  private brandMasterModel = new BrandMasterModel();
  private userModel = new UserModel();

  private generateAdminUsername(name: string): string {
    return name.toLowerCase().replace(/\s+/g, ".");
  }

  async getSelf(domain: string) {
    return await this.brandMasterModel.getSelf(domain);
  }

  async getById(idBrandMaster: number) {
    return this.brandMasterModel.getById(idBrandMaster);
  }

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.brandMasterModel.listAll(validQuery);
  }

  async createNewBrandMaster(data: TBrandMaster) {
    const validData = brandMasterSchema.parse(data);

    const { admName, admEmail, admPhone, admPassword, ...brandMasterData } =
      validData;

    if (admEmail) {
      const existingEmail = await this.userModel.getByEmail(admEmail);
      if (existingEmail) {
        throw new AppError(
          ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
          STATUS_CODE.CONFLICT,
        );
      }
    }

    const admUsername = admName ? this.generateAdminUsername(admName) : null;

    if (admUsername) {
      const existingUsername = await this.userModel.getByUsername(admUsername);
      if (existingUsername) {
        throw new AppError(
          ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
          STATUS_CODE.CONFLICT,
        );
      }
    }

    if (brandMasterData.contract) {
      brandMasterData.contractAt = new Date();
    }

    if (brandMasterData.isPoc) {
      brandMasterData.pocOpenedAt = new Date();
    }

    const newBrandMaster =
      await this.brandMasterModel.createNewBrandMaster(brandMasterData);

    let adminUser = null;
    if (admEmail && admPassword && admName) {
      const hashedPassword = await bcrypt.hash(admPassword, 10);
      adminUser = await this.userModel.createUser({
        username: admUsername!,
        email: admEmail,
        password: hashedPassword,
        fullName: admName,
        userPhoneNumber: admPhone || null,
        role: "admin",
        idBrandMaster: newBrandMaster.idBrandMaster,
        isActive: true,
      });
    }

    return {
      ...newBrandMaster,
      adminUser,
    };
  }

  private async update({
    validData,
    idBrandMaster,
  }: {
    user: user;
    validData: Omit<
      TBrandMaster,
      "admName" | "admEmail" | "admPhone" | "admPassword"
    >;
    idBrandMaster: number;
    oldBrandMaster: brandMaster;
  }) {
    return await this.brandMasterModel.updateBrandMaster(
      idBrandMaster,
      validData,
    );
  }

  async updateBrandMaster(idBrandMaster: number, data: unknown, user: user) {
    const validData = brandMasterSchema.parse(data);

    // Extract admin fields from validData
    const { admName, admEmail, admPhone, admPassword, ...brandMasterData } =
      validData;
    const isBrandAdmin = user.role === "admin" && Boolean(user.idBrandMaster);

    if (!isBrandAdmin) {
      delete brandMasterData.emailContact;
      delete brandMasterData.smsContact;
      delete brandMasterData.timezone;
    }

    const oldBrandMaster = await this.brandMasterModel.getById(idBrandMaster);
    if (!oldBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (user.idBrandMaster && user.idBrandMaster !== idBrandMaster) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    let updatedAdminUser = null;
    if (admName || admEmail || admPhone || admPassword) {
      const existingAdmin =
        await this.userModel.getAdminByBrandMasterId(idBrandMaster);

      if (existingAdmin) {
        if (admEmail && admEmail !== existingAdmin.email) {
          const emailExists = await this.userModel.getByEmail(admEmail);
          if (emailExists) {
            throw new AppError(
              ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
              STATUS_CODE.CONFLICT,
            );
          }
        }

        const adminUpdateData: {
          fullName?: string;
          email?: string;
          userPhoneNumber?: string | null;
          password?: string;
          username?: string;
        } = {};

        if (admName) {
          const newUsername = this.generateAdminUsername(admName);
          if (newUsername !== existingAdmin.username) {
            const existingUsername =
              await this.userModel.getByUsername(newUsername);
            if (existingUsername) {
              throw new AppError(
                ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
                STATUS_CODE.CONFLICT,
              );
            }
          }
          adminUpdateData.fullName = admName;
          adminUpdateData.username = newUsername;
        }
        if (admEmail) {
          adminUpdateData.email = admEmail;
        }
        if (admPhone !== undefined) {
          adminUpdateData.userPhoneNumber = admPhone;
        }
        if (admPassword) {
          adminUpdateData.password = await bcrypt.hash(admPassword, 10);
        }

        if (Object.keys(adminUpdateData).length > 0) {
          updatedAdminUser = await this.userModel.updateUser(
            existingAdmin.idUser,
            adminUpdateData,
          );
        }
      }
    }

    if (
      !oldBrandMaster.contract &&
      brandMasterData.contract &&
      !oldBrandMaster.contractAt
    ) {
      brandMasterData.contractAt = new Date();
    }

    if (
      brandMasterData.brandLogo !== undefined &&
      brandMasterData.brandLogo !== oldBrandMaster.brandLogo &&
      user.role !== "admin"
    ) {
      throw new AppError(
        "Apenas administradores podem alterar a logo da empresa",
        STATUS_CODE.FORBIDDEN,
      );
    }

    if (user.role === "member") {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    if (
      brandMasterData.isPoc === true &&
      oldBrandMaster.isPoc !== true &&
      !oldBrandMaster.pocOpenedAt
    ) {
      brandMasterData.pocOpenedAt = new Date();
    }

    const updatedBrandMaster = await this.update({
      user,
      validData: brandMasterData,
      idBrandMaster,
      oldBrandMaster,
    });

    return {
      ...updatedBrandMaster,
      adminUser: updatedAdminUser,
    };
  }

  async deleteBrandMaster(idBrandMaster: number) {
    const oldBrandMaster = await this.brandMasterModel.getById(idBrandMaster);
    if (!oldBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    const deletedBrand =
      await this.brandMasterModel.deleteBrandMaster(idBrandMaster);

    return {
      brandMaster: deletedBrand,
    };
  }
}
