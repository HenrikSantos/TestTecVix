import { BrandMasterModel } from "../../src/models/BrandMasterModel";
import { prismaMock } from "../singleton";

describe("BrandMasterModel", () => {
  const model = new BrandMasterModel();

  it("getSelf should fetch by domain with selected fields", async () => {
    prismaMock.brandMaster.findFirst.mockResolvedValueOnce(null);

    await model.getSelf("example.com");

    expect(prismaMock.brandMaster.findFirst).toHaveBeenCalledWith({
      where: {
        domain: { contains: "example.com" },
        deletedAt: null,
      },
      select: expect.objectContaining({
        idBrandMaster: true,
        brandName: true,
        domain: true,
      }),
    });
  });

  it("getById should fetch by id", async () => {
    prismaMock.brandMaster.findUnique.mockResolvedValueOnce(null);

    await model.getById(10);

    expect(prismaMock.brandMaster.findUnique).toHaveBeenCalledWith({
      where: { idBrandMaster: 10 },
    });
  });

  it("totalCount should consider deletedAt when excluding deleted", async () => {
    prismaMock.brandMaster.count.mockResolvedValueOnce(0);

    await model.totalCount({ search: "test", isPoc: true, orderBy: [] }, false);

    expect(prismaMock.brandMaster.count).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        isPoc: true,
        brandName: { contains: "test" },
      },
    });
  });

  it("totalCount should ignore deletedAt when including deleted", async () => {
    prismaMock.brandMaster.count.mockResolvedValueOnce(0);

    await model.totalCount({ search: "test", isPoc: false, orderBy: [] }, true);

    expect(prismaMock.brandMaster.count).toHaveBeenCalledWith({
      where: {
        isPoc: false,
        brandName: { contains: "test" },
      },
    });
  });

  it("listAll should use default orderBy when not provided", async () => {
    prismaMock.brandMaster.findMany.mockResolvedValueOnce([]);
    const totalSpy = jest.spyOn(model, "totalCount").mockResolvedValueOnce(0);

    const result = await model.listAll(
      { page: 1, limit: 10, orderBy: [] },
      false,
    );

    expect(prismaMock.brandMaster.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 10,
        orderBy: [{ updatedAt: "desc" }],
      }),
    );
    expect(totalSpy).toHaveBeenCalled();
    expect(result).toEqual({ totalCount: 0, result: [] });
  });

  it("listAll should respect provided orderBy", async () => {
    prismaMock.brandMaster.findMany.mockResolvedValueOnce([]);
    jest.spyOn(model, "totalCount").mockResolvedValueOnce(0);

    await model.listAll(
      {
        orderBy: [{ field: "brandName", direction: "asc" }],
      },
      false,
    );

    expect(prismaMock.brandMaster.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ brandName: "asc" }],
      }),
    );
  });

  it("createNewBrandMaster should create brand master", async () => {
    prismaMock.brandMaster.create.mockResolvedValueOnce({
      idBrandMaster: 1,
    } as any);

    await model.createNewBrandMaster({
      brandName: "Test",
      brandLogo: "logo.png",
      domain: "test.com",
      setorName: "setor",
      fieldName: "field",
      location: "loc",
      city: "city",
      emailContact: "contact@test.com",
      smsContact: "123",
      timezone: "UTC",
      stripeUserId: "stripe",
      manual: "manual",
      termsOfUse: "terms",
      privacyPolicy: "privacy",
      isPoc: false,
    });

    expect(prismaMock.brandMaster.create).toHaveBeenCalled();
  });

  it("updateBrandMaster should update with updatedAt", async () => {
    prismaMock.brandMaster.update.mockResolvedValueOnce({
      idBrandMaster: 1,
    } as any);

    await model.updateBrandMaster(1, {
      brandName: "Updated",
      brandLogo: "logo.png",
      domain: "test.com",
      setorName: "setor",
      fieldName: "field",
      location: "loc",
      city: "city",
      emailContact: "contact@test.com",
      smsContact: "123",
      timezone: "UTC",
      stripeUserId: "stripe",
      manual: "manual",
      termsOfUse: "terms",
      privacyPolicy: "privacy",
      isPoc: false,
    });

    expect(prismaMock.brandMaster.update).toHaveBeenCalledWith({
      where: { idBrandMaster: 1 },
      data: expect.objectContaining({ updatedAt: expect.any(Date) }),
    });
  });

  it("deleteBrandMaster should mark as deleted", async () => {
    prismaMock.brandMaster.update.mockResolvedValueOnce({
      idBrandMaster: 1,
    } as any);

    await model.deleteBrandMaster(1);

    expect(prismaMock.brandMaster.update).toHaveBeenCalledWith({
      where: { idBrandMaster: 1 },
      data: expect.objectContaining({
        updatedAt: expect.any(Date),
        deletedAt: expect.any(Date),
      }),
    });
  });
});
