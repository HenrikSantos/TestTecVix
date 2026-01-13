import { Response } from "express";
import { BrandMasterController } from "../../src/controllers/BrandMasterController";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { AppError } from "../../src/errors/AppError";
import { CustomRequest } from "../../src/types/custom";

const mockService = {
  getSelf: jest.fn(),
  getById: jest.fn(),
  listAll: jest.fn(),
  createNewBrandMaster: jest.fn(),
  updateBrandMaster: jest.fn(),
  deleteBrandMaster: jest.fn(),
};

jest.mock("../../src/services/BrandMasterService", () => ({
  BrandMasterService: jest.fn().mockImplementation(() => mockService),
}));

describe("BrandMasterController", () => {
  let controller: BrandMasterController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new BrandMasterController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("getSelf should return null when domain is empty", async () => {
    const mockRequest = {
      headers: {},
    } as unknown as CustomRequest<unknown>;

    await controller.getSelf(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(null);
    expect(mockService.getSelf).not.toHaveBeenCalled();
  });

  it("getSelf should fetch by domain extracted from host", async () => {
    mockService.getSelf.mockResolvedValueOnce({ idBrandMaster: 1 });
    const mockRequest = {
      headers: { host: "https://example.com:3000" },
    } as unknown as CustomRequest<unknown>;

    await controller.getSelf(mockRequest, mockResponse as Response);

    expect(mockService.getSelf).toHaveBeenCalledWith("example.com");
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ idBrandMaster: 1 });
  });

  it("getById should call service with numeric id", async () => {
    mockService.getById.mockResolvedValueOnce({ idBrandMaster: 2 });
    const mockRequest = {
      params: { idBrandMaster: "2" },
    } as unknown as CustomRequest<unknown>;

    await controller.getById(mockRequest, mockResponse as Response);

    expect(mockService.getById).toHaveBeenCalledWith(2);
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("listAll should forward query to the service", async () => {
    mockService.listAll.mockResolvedValueOnce({ totalCount: 0, result: [] });
    const mockRequest = {
      query: { search: "test" },
    } as unknown as CustomRequest<unknown>;

    await controller.listAll(mockRequest, mockResponse as Response);

    expect(mockService.listAll).toHaveBeenCalledWith({ search: "test" });
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("createNewBrandMaster should return CREATED", async () => {
    mockService.createNewBrandMaster.mockResolvedValueOnce({
      idBrandMaster: 3,
    });
    const mockRequest = {
      body: { brandName: "Test" },
    } as unknown as CustomRequest<unknown>;

    await controller.createNewBrandMaster(
      mockRequest,
      mockResponse as Response,
    );

    expect(mockService.createNewBrandMaster).toHaveBeenCalledWith({
      brandName: "Test",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.CREATED);
  });

  it("updateBrandMaster should use user id when available", async () => {
    mockService.updateBrandMaster.mockResolvedValueOnce({ idBrandMaster: 4 });
    const mockRequest = {
      params: { idBrandMaster: "99" },
      body: { brandName: "Updated" },
      user: { idBrandMaster: 4 },
    } as unknown as CustomRequest<unknown>;

    await controller.updateBrandMaster(mockRequest, mockResponse as Response);

    expect(mockService.updateBrandMaster).toHaveBeenCalledWith(
      4,
      { brandName: "Updated" },
      { idBrandMaster: 4 },
    );
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("updateBrandMaster should throw error when id is invalid", async () => {
    const mockRequest = {
      params: { idBrandMaster: "abc" },
      body: {},
      user: {},
    } as unknown as CustomRequest<unknown>;

    await expect(
      controller.updateBrandMaster(mockRequest, mockResponse as Response),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deleteBrandMaster should call service with numeric id", async () => {
    mockService.deleteBrandMaster.mockResolvedValueOnce({ idBrandMaster: 5 });
    const mockRequest = {
      params: { idBrandMaster: "5" },
    } as unknown as CustomRequest<unknown>;

    await controller.deleteBrandMaster(mockRequest, mockResponse as Response);

    expect(mockService.deleteBrandMaster).toHaveBeenCalledWith(5);
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });
});
