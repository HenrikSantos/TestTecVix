import { prisma } from "../database/client";
import { TUserCreated } from "../types/validations/User/createUser";
import { TUserUpdated } from "../types/validations/User/updateUser";
import { TQuery } from "../types/validations/Queries/queryListAll";

export class UserModel {
  async getById(idUser: string) {
    return prisma.user.findUnique({
      where: { idUser },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        fullName: true,
        userPhoneNumber: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async getByUsername(username: string) {
    return prisma.user.findFirst({
      where: { username, deletedAt: null },
    });
  }

  async getAdminByBrandMasterId(idBrandMaster: number) {
    return prisma.user.findFirst({
      where: {
        idBrandMaster,
        role: "admin",
        deletedAt: null,
      },
    });
  }

  async totalCount(query: TQuery, isIncludeDeleted?: boolean) {
    return prisma.user.count({
      where: {
        ...(!isIncludeDeleted && { deletedAt: null }),
        idBrandMaster: query.idBrandMaster,
        isActive: query.isActive,
        OR: query.search
          ? [
              { username: { contains: query.search } },
              { email: { contains: query.search } },
            ]
          : undefined,
      },
    });
  }

  async listAll(query: TQuery, isIncludeDeleted?: boolean) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const users = await prisma.user.findMany({
      where: {
        ...(!isIncludeDeleted && { deletedAt: null }),
        idBrandMaster: query.idBrandMaster,
        isActive: query.isActive,
        OR: query.search
          ? [
              { username: { contains: query.search } },
              { email: { contains: query.search } },
            ]
          : undefined,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        fullName: true,
        userPhoneNumber: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
      },
      take: limit || undefined,
      skip,
      ...(orderBy.length ? { orderBy } : { orderBy: [{ updatedAt: "desc" }] }),
    });

    const totalCount = await this.totalCount(query, isIncludeDeleted);
    return { totalCount, result: users };
  }

  async createUser(data: TUserCreated & { password: string }) {
    return prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        profileImgUrl: data.profileImgUrl,
        fullName: data.fullName,
        userPhoneNumber: data.userPhoneNumber,
        role: data.role || "member",
        idBrandMaster: data.idBrandMaster,
        isActive: data.isActive ?? true,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        fullName: true,
        userPhoneNumber: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async updateUser(idUser: string, data: TUserUpdated & { password?: string }) {
    return prisma.user.update({
      where: { idUser },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        fullName: true,
        userPhoneNumber: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateLastLogin(idUser: string) {
    return prisma.user.update({
      where: { idUser },
      data: { lastLoginDate: new Date() },
    });
  }

  async deleteUser(idUser: string) {
    return prisma.user.update({
      where: { idUser },
      data: { deletedAt: new Date(), updatedAt: new Date() },
    });
  }
}
