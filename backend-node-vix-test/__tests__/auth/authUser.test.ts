import { Response, NextFunction } from "express";
import { authUser } from "../../src/auth/authUser";
import { genToken } from "../../src/utils/jwt";
import { AppError } from "../../src/errors/AppError";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { CustomRequest } from "../../src/types/custom";
import { IJwtPayload } from "../../src/utils/jwt";

describe("authUser Middleware", () => {
  let mockRequest: Partial<CustomRequest<IJwtPayload>>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const validPayload: IJwtPayload = {
    idUser: "user-123",
    email: "test@example.com",
    role: "admin",
    idBrandMaster: 1,
  };

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  describe("successful authentication", () => {
    it("should call next() when a valid token is provided", async () => {
      const token = genToken(validPayload);
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authUser(
        mockRequest as CustomRequest<IJwtPayload>,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("should add user data to the request", async () => {
      const token = genToken(validPayload);
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authUser(
        mockRequest as CustomRequest<IJwtPayload>,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.idUser).toBe(validPayload.idUser);
      expect(mockRequest.user?.email).toBe(validPayload.email);
      expect(mockRequest.user?.role).toBe(validPayload.role);
    });

    it("should work with a user without idBrandMaster", async () => {
      const payloadWithoutBrand: IJwtPayload = {
        ...validPayload,
        idBrandMaster: null,
      };
      const token = genToken(payloadWithoutBrand);
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authUser(
        mockRequest as CustomRequest<IJwtPayload>,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user?.idBrandMaster).toBeNull();
    });
  });

  describe("authentication failures", () => {
    it("should throw UNAUTHORIZED when header is missing", async () => {
      mockRequest.headers = {};

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("should throw when token does not have Bearer prefix", async () => {
      const token = genToken(validPayload);
      mockRequest.headers = {
        authorization: token,
      };

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("should throw when prefix is not Bearer", async () => {
      const token = genToken(validPayload);
      mockRequest.headers = {
        authorization: `Basic ${token}`,
      };

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("should throw when token is invalid", async () => {
      mockRequest.headers = {
        authorization: "Bearer invalid-token",
      };

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("should throw when authorization has more than 2 parts", async () => {
      mockRequest.headers = {
        authorization: "Bearer token extra",
      };

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("should not call next() when authentication fails", async () => {
      mockRequest.headers = {};

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
      } catch {
        // Expected
      }

      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
