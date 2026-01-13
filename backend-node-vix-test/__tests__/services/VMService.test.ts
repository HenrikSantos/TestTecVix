import { VMService } from "../../src/services/VMService";
import { VMModel } from "../../src/models/VMModel";
import { AppError } from "../../src/errors/AppError";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { ERROR_MESSAGE } from "../../src/constants/erroMessages";

jest.mock("../../src/models/VMModel");

const MockedVMModel = VMModel as jest.MockedClass<typeof VMModel>;

describe("VMService", () => {
  let vmService: VMService;
  let mockGetById: jest.Mock;
  let mockListAll: jest.Mock;
  let mockCreateNewVM: jest.Mock;
  let mockUpdateVM: jest.Mock;
  let mockDeleteVM: jest.Mock;

  const baseUser = {
    idUser: "user-1",
    role: "admin",
    idBrandMaster: 1,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetById = jest.fn();
    mockListAll = jest.fn();
    mockCreateNewVM = jest.fn();
    mockUpdateVM = jest.fn();
    mockDeleteVM = jest.fn();

    MockedVMModel.prototype.getById = mockGetById;
    MockedVMModel.prototype.listAll = mockListAll;
    MockedVMModel.prototype.createNewVM = mockCreateNewVM;
    MockedVMModel.prototype.updateVM = mockUpdateVM;
    MockedVMModel.prototype.deleteVM = mockDeleteVM;

    vmService = new VMService();
  });

  it("listAll should override idBrandMaster when user has brand", async () => {
    mockListAll.mockResolvedValue({ totalCount: 0, result: [] });

    await vmService.listAll({ limit: "10" }, baseUser);

    expect(mockListAll).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ idBrandMaster: 1 }),
      }),
    );
  });

  it("createNewVM should forbid member users", async () => {
    await expect(
      vmService.createNewVM({ vCPU: 1, ram: 1, disk: 20 }, {
        ...baseUser,
        role: "member",
      } as any),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("createNewVM should set status RUNNING and idBrandMaster from user", async () => {
    mockCreateNewVM.mockResolvedValue({ idVM: 1 });

    await vmService.createNewVM(
      { vCPU: 1, ram: 1, disk: 20, idBrandMaster: 99 },
      baseUser,
    );

    expect(mockCreateNewVM).toHaveBeenCalledWith(
      expect.objectContaining({
        idBrandMaster: 1,
        status: "RUNNING",
      }),
    );
  });

  it("updateVM should throw NOT_FOUND when VM does not exist", async () => {
    mockGetById.mockResolvedValue(null);

    await expect(
      vmService.updateVM(1, { vmName: "Updated" }, baseUser),
    ).rejects.toMatchObject({ status: STATUS_CODE.NOT_FOUND });
  });

  it("updateVM should forbid member users", async () => {
    await expect(
      vmService.updateVM(1, { vmName: "Updated" }, {
        ...baseUser,
        role: "member",
      } as any),
    ).rejects.toMatchObject({ status: STATUS_CODE.FORBIDDEN });
  });

  it("updateVM should forbid when VM belongs to another brand", async () => {
    mockGetById.mockResolvedValue({ idVM: 1, idBrandMaster: 2 });

    await expect(
      vmService.updateVM(1, { vmName: "Updated" }, baseUser),
    ).rejects.toMatchObject({ status: STATUS_CODE.FORBIDDEN });
  });

  it("updateVM should update when valid", async () => {
    mockGetById.mockResolvedValue({ idVM: 1, idBrandMaster: 1 });
    mockUpdateVM.mockResolvedValue({ idVM: 1, vmName: "Updated" });

    const result = await vmService.updateVM(1, { vmName: "Updated" }, baseUser);

    expect(mockUpdateVM).toHaveBeenCalledWith(1, { vmName: "Updated" });
    expect(result).toEqual({ idVM: 1, vmName: "Updated" });
  });

  it("deleteVM should forbid member or manager users", async () => {
    await expect(
      vmService.deleteVM(1, { ...baseUser, role: "member" } as any),
    ).rejects.toMatchObject({ status: STATUS_CODE.FORBIDDEN });

    await expect(
      vmService.deleteVM(1, { ...baseUser, role: "manager" } as any),
    ).rejects.toMatchObject({ status: STATUS_CODE.FORBIDDEN });
  });

  it("deleteVM should throw NOT_FOUND when VM does not exist", async () => {
    mockGetById.mockResolvedValue(null);

    await expect(vmService.deleteVM(1, baseUser)).rejects.toMatchObject({
      status: STATUS_CODE.NOT_FOUND,
      message: ERROR_MESSAGE.NOT_FOUND,
    });
  });

  it("deleteVM should forbid when VM belongs to another brand", async () => {
    mockGetById.mockResolvedValue({ idVM: 1, idBrandMaster: 2 });

    await expect(vmService.deleteVM(1, baseUser)).rejects.toMatchObject({
      status: STATUS_CODE.FORBIDDEN,
    });
  });

  it("deleteVM should delete when valid", async () => {
    mockGetById.mockResolvedValue({ idVM: 1, idBrandMaster: 1 });
    mockDeleteVM.mockResolvedValue({ idVM: 1 });

    const result = await vmService.deleteVM(1, baseUser);

    expect(mockDeleteVM).toHaveBeenCalledWith(1);
    expect(result).toEqual({ idVM: 1 });
  });
});
