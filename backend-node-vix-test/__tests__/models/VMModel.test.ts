import { VMModel } from "../../src/models/VMModel";
import { prismaMock } from "../singleton";

describe("VMModel", () => {
  const model = new VMModel();

  it("getById should fetch VM by id", async () => {
    prismaMock.vM.findUnique.mockResolvedValueOnce(null);

    await model.getById(1);

    expect(prismaMock.vM.findUnique).toHaveBeenCalledWith({
      where: { idVM: 1 },
    });
  });

  it("totalCount should prioritize query idBrandMaster when numeric", async () => {
    prismaMock.vM.count.mockResolvedValueOnce(0);

    await model.totalCount({
      query: { idBrandMaster: 5, search: "vm", orderBy: [], status: null },
      idBrandMaster: 9,
    });

    expect(prismaMock.vM.count).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        idBrandMaster: 5,
        status: null,
        vmName: { contains: "vm" },
      },
    });
  });

  it("totalCount should use user idBrandMaster when query is not numeric", async () => {
    prismaMock.vM.count.mockResolvedValueOnce(0);

    await model.totalCount({
      query: {
        idBrandMaster: "null",
        search: undefined,
        orderBy: [],
        status: null,
      },
      idBrandMaster: 9,
    });

    expect(prismaMock.vM.count).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        idBrandMaster: 9,
        status: null,
        vmName: { contains: undefined },
      },
    });
  });

  it("listAll should use default orderBy and return totalCount", async () => {
    prismaMock.vM.findMany.mockResolvedValueOnce([]);
    const totalSpy = jest.spyOn(model, "totalCount").mockResolvedValueOnce(0);

    const result = await model.listAll({
      query: { limit: 5, page: 1, orderBy: [], status: null },
      idBrandMaster: 2,
    });

    expect(prismaMock.vM.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 5,
        orderBy: { updatedAt: "desc" },
      }),
    );
    expect(totalSpy).toHaveBeenCalled();
    expect(result).toEqual({ totalCount: 0, result: [] });
  });

  it("listAll should respect provided orderBy", async () => {
    prismaMock.vM.findMany.mockResolvedValueOnce([]);
    jest.spyOn(model, "totalCount").mockResolvedValueOnce(0);

    await model.listAll({
      query: { orderBy: [{ field: "vmName", direction: "asc" }], status: null },
      idBrandMaster: 2,
    });

    expect(prismaMock.vM.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ vmName: "asc" }],
      }),
    );
  });

  it("createNewVM should create VM", async () => {
    prismaMock.vM.create.mockResolvedValueOnce({ idVM: 1 } as any);

    await model.createNewVM({
      vmName: "VM",
      vCPU: 1,
      ram: 1,
      disk: 10,
      idBrandMaster: 1,
      hasBackup: false,
    });

    expect(prismaMock.vM.create).toHaveBeenCalled();
  });

  it("updateVM should update with updatedAt", async () => {
    prismaMock.vM.update.mockResolvedValueOnce({ idVM: 1 } as any);

    await model.updateVM(1, { vmName: "Updated" });

    expect(prismaMock.vM.update).toHaveBeenCalledWith({
      where: { idVM: 1 },
      data: expect.objectContaining({ updatedAt: expect.any(Date) }),
    });
  });

  it("deleteVM should set deletedAt", async () => {
    prismaMock.vM.update.mockResolvedValueOnce({ idVM: 1 } as any);

    await model.deleteVM(1);

    expect(prismaMock.vM.update).toHaveBeenCalledWith({
      where: { idVM: 1 },
      data: expect.objectContaining({
        updatedAt: expect.any(Date),
        deletedAt: expect.any(Date),
      }),
    });
  });
});
