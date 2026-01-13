import { Response, NextFunction } from "express";
import { isAdmin } from "../../src/auth/isAdmin";
import { AppError } from "../../src/errors/AppError";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { CustomRequest } from "../../src/types/custom";
import { IJwtPayload } from "../../src/utils/jwt";

describe("isAdmin Middleware", () => {
  let mockRequest: Partial<CustomRequest<IJwtPayload>>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  it("should allow when user is admin", () => {
    mockRequest.user = {
      idUser: "user-1",
      email: "admin@example.com",
      role: "admin",
      idBrandMaster: 1,
    };

    isAdmin(
      mockRequest as CustomRequest<IJwtPayload>,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it("should block when user is not admin", () => {
    mockRequest.user = {
      idUser: "user-2",
      email: "user@example.com",
      role: "manager",
      idBrandMaster: 1,
    };

    try {
      isAdmin(
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
