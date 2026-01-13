import { Response, NextFunction } from "express";
import { isSelfOrIsManagerOrIsAdm } from "../../src/auth/isSelfOrIsManagerOrIsAdm";
import { AppError } from "../../src/errors/AppError";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { CustomRequest } from "../../src/types/custom";
import { IJwtPayload } from "../../src/utils/jwt";

describe("isSelfOrIsManagerOrIsAdm Middleware", () => {
  let mockRequest: Partial<CustomRequest<IJwtPayload>>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = { params: {} };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it("should allow when user is the same user", () => {
    mockRequest.user = {
      idUser: "user-1",
      email: "user@example.com",
      role: "user",
      idBrandMaster: 1,
    };
    mockRequest.params = { idUser: "user-1" };

    isSelfOrIsManagerOrIsAdm(
      mockRequest as CustomRequest<IJwtPayload>,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it("should allow when user is manager", () => {
    mockRequest.user = {
      idUser: "user-2",
      email: "manager@example.com",
      role: "manager",
      idBrandMaster: 1,
    };
    mockRequest.params = { idUser: "another-user" };

    isSelfOrIsManagerOrIsAdm(
      mockRequest as CustomRequest<IJwtPayload>,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it("should allow when user is admin", () => {
    mockRequest.user = {
      idUser: "user-3",
      email: "admin@example.com",
      role: "admin",
      idBrandMaster: 1,
    };
    mockRequest.params = { idUser: "another-user" };

    isSelfOrIsManagerOrIsAdm(
      mockRequest as CustomRequest<IJwtPayload>,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it("should block when user is not self, manager, or admin", () => {
    mockRequest.user = {
      idUser: "user-4",
      email: "user@example.com",
      role: "user",
      idBrandMaster: 1,
    };
    mockRequest.params = { idUser: "another-user" };

    try {
      isSelfOrIsManagerOrIsAdm(
        mockRequest as CustomRequest<IJwtPayload>,
        mockResponse as Response,
        mockNext,
      );
      fail("Expected to throw an error");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).status).toBe(STATUS_CODE.FORBIDDEN);
    }
  });
});
