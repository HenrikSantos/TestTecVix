import { Response } from "express";
import { UserController } from "../../src/controllers/UserController";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { CustomRequest } from "../../src/types/custom";

const mockService = {
  getById: jest.fn(),
  listAll: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  login: jest.fn(),
};

jest.mock("../../src/services/UserService", () => ({
  UserService: jest.fn().mockImplementation(() => mockService),
}));

describe("UserController", () => {
  let controller: UserController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new UserController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("getById should call service with id and user", async () => {
    mockService.getById.mockResolvedValueOnce({ idUser: "1" });
    const mockRequest = {
      params: { idUser: "1" },
      user: { idUser: "admin" },
    } as unknown as CustomRequest<unknown>;

    await controller.getById(mockRequest, mockResponse as Response);

    expect(mockService.getById).toHaveBeenCalledWith("1", { idUser: "admin" });
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("listAll should forward query and user", async () => {
    mockService.listAll.mockResolvedValueOnce({ totalCount: 0, result: [] });
    const mockRequest = {
      query: { page: 1 },
      user: { idUser: "admin" },
    } as unknown as CustomRequest<unknown>;

    await controller.listAll(mockRequest, mockResponse as Response);

    expect(mockService.listAll).toHaveBeenCalledWith(
      { page: 1 },
      { idUser: "admin" },
    );
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("createUser should return CREATED", async () => {
    mockService.createUser.mockResolvedValueOnce({ idUser: "1" });
    const mockRequest = {
      body: { username: "john" },
      user: { idUser: "admin" },
    } as unknown as CustomRequest<unknown>;

    await controller.createUser(mockRequest, mockResponse as Response);

    expect(mockService.createUser).toHaveBeenCalledWith(
      { username: "john" },
      { idUser: "admin" },
    );
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.CREATED);
  });

  it("updateUser should call service with id, body, and user", async () => {
    mockService.updateUser.mockResolvedValueOnce({ idUser: "1" });
    const mockRequest = {
      params: { idUser: "1" },
      body: { fullName: "John" },
      user: { idUser: "admin" },
    } as unknown as CustomRequest<unknown>;

    await controller.updateUser(mockRequest, mockResponse as Response);

    expect(mockService.updateUser).toHaveBeenCalledWith(
      "1",
      { fullName: "John" },
      { idUser: "admin" },
    );
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("deleteUser should call service with id and user", async () => {
    mockService.deleteUser.mockResolvedValueOnce({ idUser: "1" });
    const mockRequest = {
      params: { idUser: "1" },
      user: { idUser: "admin" },
    } as unknown as CustomRequest<unknown>;

    await controller.deleteUser(mockRequest, mockResponse as Response);

    expect(mockService.deleteUser).toHaveBeenCalledWith("1", {
      idUser: "admin",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });

  it("login should forward body and return OK", async () => {
    mockService.login.mockResolvedValueOnce({ token: "abc" });
    const mockRequest = {
      body: { email: "user@example.com", password: "pass" },
    } as unknown as CustomRequest<unknown>;

    await controller.login(mockRequest, mockResponse as Response);

    expect(mockService.login).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "pass",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
  });
});
