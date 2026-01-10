import { genToken, verifyToken, IJwtPayload } from "../../src/utils/jwt";
import { AppError } from "../../src/errors/AppError";
import { STATUS_CODE } from "../../src/constants/statusCode";

describe("JWT Utils", () => {
  const mockPayload: IJwtPayload = {
    idUser: "user-123",
    email: "test@example.com",
    role: "admin",
    idBrandMaster: 1,
  };

  describe("genToken", () => {
    it("deve gerar um token JWT valido", () => {
      const token = genToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("deve gerar tokens diferentes para payloads diferentes", () => {
      const token1 = genToken(mockPayload);
      const token2 = genToken({ ...mockPayload, idUser: "user-456" });

      expect(token1).not.toBe(token2);
    });

    it("deve gerar token para usuario sem idBrandMaster", () => {
      const payloadWithoutBrand: IJwtPayload = {
        ...mockPayload,
        idBrandMaster: null,
      };

      const token = genToken(payloadWithoutBrand);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });
  });

  describe("verifyToken", () => {
    it("deve verificar e decodificar um token valido", () => {
      const token = genToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.idUser).toBe(mockPayload.idUser);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.idBrandMaster).toBe(mockPayload.idBrandMaster);
    });

    it("deve lancar AppError para token invalido", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyToken(invalidToken)).toThrow(AppError);
    });

    it("deve lancar erro com status UNAUTHORIZED para token invalido", () => {
      const invalidToken = "invalid.token.here";

      try {
        verifyToken(invalidToken);
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("deve lancar erro para token vazio", () => {
      expect(() => verifyToken("")).toThrow(AppError);
    });

    it("deve lancar erro para token malformado", () => {
      const malformedToken = "abc123";

      expect(() => verifyToken(malformedToken)).toThrow(AppError);
    });
  });

  describe("integracao genToken e verifyToken", () => {
    it("deve gerar e verificar token corretamente", () => {
      const token = genToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.idUser).toBe(mockPayload.idUser);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("deve manter dados do payload apos encode/decode", () => {
      const customPayload: IJwtPayload = {
        idUser: "custom-user-id",
        email: "custom@email.com",
        role: "manager",
        idBrandMaster: 99,
      };

      const token = genToken(customPayload);
      const decoded = verifyToken(token);

      expect(decoded.idUser).toBe(customPayload.idUser);
      expect(decoded.email).toBe(customPayload.email);
      expect(decoded.role).toBe(customPayload.role);
      expect(decoded.idBrandMaster).toBe(customPayload.idBrandMaster);
    });
  });
});
