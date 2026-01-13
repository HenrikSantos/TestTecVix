import { UserModel } from "../../src/models/UserModel";
import { prismaMock } from "../singleton";

describe("UserModel", () => {
  const model = new UserModel();

  it("getById should fetch user with select", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    await model.getById("user-1");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { idUser: "user-1" },
        select: expect.objectContaining({
          idUser: true,
          username: true,
          brandMaster: expect.any(Object),
        }),
      }),
    );
  });

  it("getByEmail should filter by deletedAt null", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    await model.getByEmail("user@example.com");

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: "user@example.com", deletedAt: null },
    });
  });

  it("getByUsername should filter by deletedAt null", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    await model.getByUsername("user");

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: "user", deletedAt: null },
    });
  });

  it("getAdminByBrandMasterId should filter by admin role", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    await model.getAdminByBrandMasterId(2);

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { idBrandMaster: 2, role: "admin", deletedAt: null },
    });
  });

  it("totalCount should build OR when search is provided", async () => {
    prismaMock.user.count.mockResolvedValueOnce(0);

    await model.totalCount(
      { search: "john", isActive: true, orderBy: [] },
      false,
    );

    expect(prismaMock.user.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
          isActive: true,
          OR: [
            { username: { contains: "john" } },
            { email: { contains: "john" } },
          ],
        }),
      }),
    );
  });

  it("totalCount should ignore deletedAt when including deleted", async () => {
    prismaMock.user.count.mockResolvedValueOnce(0);

    await model.totalCount({ search: undefined, orderBy: [] }, true);

    expect(prismaMock.user.count).toHaveBeenCalledWith({
      where: {
        idBrandMaster: undefined,
        isActive: undefined,
        OR: undefined,
      },
    });
  });

  it("listAll should use default orderBy and include totalCount", async () => {
    prismaMock.user.findMany.mockResolvedValueOnce([]);
    const totalSpy = jest.spyOn(model, "totalCount").mockResolvedValueOnce(0);

    const result = await model.listAll(
      { page: 0, limit: 5, orderBy: [] },
      false,
    );

    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 0,
        orderBy: [{ updatedAt: "desc" }],
      }),
    );
    expect(totalSpy).toHaveBeenCalled();
    expect(result).toEqual({ totalCount: 0, result: [] });
  });

  it("createUser should apply defaults and convert contractDate", async () => {
    prismaMock.user.create.mockResolvedValueOnce({
      idUser: "user-1",
      username: "john",
    } as any);

    await model.createUser({
      username: "john",
      email: "john@example.com",
      fullName: "John",
      userPhoneNumber: "111",
      idBrandMaster: 1,
      password: "hashed",
      isActive: true,
      contractDate: "2024-01-01",
    });

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          role: "member",
          isActive: true,
          contractDate: expect.any(Date),
        }),
      }),
    );
  });

  it("updateUser should update updatedAt and convert contractDate", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ idUser: "user-1" } as any);

    await model.updateUser("user-1", { contractDate: "2024-02-01" });

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { idUser: "user-1" },
        data: expect.objectContaining({
          updatedAt: expect.any(Date),
          contractDate: expect.any(Date),
        }),
      }),
    );
  });

  it("updateLastLogin should set lastLoginDate", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ idUser: "user-1" } as any);

    await model.updateLastLogin("user-1");

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { idUser: "user-1" },
      data: { lastLoginDate: expect.any(Date) },
    });
  });

  it("deleteUser should set deletedAt", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ idUser: "user-1" } as any);

    await model.deleteUser("user-1");

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { idUser: "user-1" },
      data: {
        deletedAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
