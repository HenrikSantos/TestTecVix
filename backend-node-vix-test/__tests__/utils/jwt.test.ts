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
    it("should generate a valid JWT token", () => {
      const token = genToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should generate different tokens for different payloads", () => {
      const token1 = genToken(mockPayload);
      const token2 = genToken({ ...mockPayload, idUser: "user-456" });

      expect(token1).not.toBe(token2);
    });

    it("should generate token for user without idBrandMaster", () => {
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
    it("should verify and decode a valid token", () => {
      const token = genToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.idUser).toBe(mockPayload.idUser);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.idBrandMaster).toBe(mockPayload.idBrandMaster);
    });

    it("should throw AppError for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyToken(invalidToken)).toThrow(AppError);
    });

    it("should throw UNAUTHORIZED for invalid token", () => {
      const invalidToken = "invalid.token.here";

      try {
        verifyToken(invalidToken);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
      }
    });

    it("should throw for empty token", () => {
      expect(() => verifyToken("")).toThrow(AppError);
    });

    it("should throw for malformed token", () => {
      const malformedToken = "abc123";

      expect(() => verifyToken(malformedToken)).toThrow(AppError);
    });
  });

  describe("genToken and verifyToken integration", () => {
    it("should generate and verify token correctly", () => {
      const token = genToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.idUser).toBe(mockPayload.idUser);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should keep payload data after encode/decode", () => {
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
