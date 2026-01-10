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

  describe("autenticacao bem-sucedida", () => {
    it("deve chamar next() quando token valido e fornecido", async () => {
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

    it("deve adicionar dados do usuario ao request", async () => {
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

    it("deve funcionar com usuario sem idBrandMaster", async () => {
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

  describe("falhas de autenticacao", () => {
    it("deve lancar erro com status UNAUTHORIZED quando header ausente", async () => {
      mockRequest.headers = {};

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("deve lancar erro quando token nao tem prefixo Bearer", async () => {
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
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("deve lancar erro quando prefixo nao e Bearer", async () => {
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
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("deve lancar erro quando token e invalido", async () => {
      mockRequest.headers = {
        authorization: "Bearer invalid-token",
      };

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("deve lancar erro quando authorization tem mais de 2 partes", async () => {
      mockRequest.headers = {
        authorization: "Bearer token extra",
      };

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("nao deve chamar next() quando autenticacao falha", async () => {
      mockRequest.headers = {};

      try {
        await authUser(
          mockRequest as CustomRequest<IJwtPayload>,
          mockResponse as Response,
          mockNext,
        );
      } catch {
        // Esperado
      }

      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
