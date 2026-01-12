import { UserService } from "../../src/services/UserService";
import { UserModel } from "../../src/models/UserModel";
import { AppError } from "../../src/errors/AppError";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { ERROR_MESSAGE } from "../../src/constants/erroMessages";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");

describe("UserService", () => {
  let userService: UserService;

  const mockUser = {
    idUser: "user-123",
    username: "testuser",
    email: "test@example.com",
    password: "$2a$10$hashedpassword",
    profileImgUrl: null,
    fullName: null,
    userPhoneNumber: null,
    role: "member" as const,
    idBrandMaster: 1,
    isActive: true,
    lastLoginDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    field: null,
    department: null,
    contractDate: null,
    brandMaster: {
      idBrandMaster: 1,
      brandName: "Test Company",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();

    jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);
    jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
    jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue(null);
    jest
      .spyOn(UserModel.prototype, "listAll")
      .mockResolvedValue({ totalCount: 0, result: [] });
    jest.spyOn(UserModel.prototype, "createUser").mockResolvedValue(mockUser);
    jest.spyOn(UserModel.prototype, "updateUser").mockResolvedValue(mockUser);
    jest
      .spyOn(UserModel.prototype, "updateLastLogin")
      .mockResolvedValue(mockUser);
    jest.spyOn(UserModel.prototype, "deleteUser").mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getById", () => {
    it("deve retornar usuario quando encontrado", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);

      const result = await userService.getById("user-123");

      expect(UserModel.prototype.getById).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(mockUser);
    });

    it("deve lancar erro com status NOT_FOUND quando usuario nao existe", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);

      try {
        await userService.getById("invalid-id");
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.NOT_FOUND);
        expect((error as AppError).message).toBe(ERROR_MESSAGE.USER_NOT_FOUND);
      }
    });
  });

  describe("listAll", () => {
    it("deve retornar lista de usuarios", async () => {
      const mockList = { totalCount: 1, result: [mockUser] };
      jest.spyOn(UserModel.prototype, "listAll").mockResolvedValue(mockList);

      const result = await userService.listAll({});

      expect(UserModel.prototype.listAll).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });

    it("deve passar query parameters para o model", async () => {
      const mockList = { totalCount: 0, result: [] };
      jest.spyOn(UserModel.prototype, "listAll").mockResolvedValue(mockList);

      const query = { limit: "10", page: "0" };
      await userService.listAll(query);

      expect(UserModel.prototype.listAll).toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    const validUserData = {
      username: "newuser",
      email: "new@example.com",
      password: "password123",
      isActive: true,
    };

    beforeEach(() => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    });

    it("deve criar usuario com sucesso", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "createUser").mockResolvedValue({
        ...mockUser,
        username: validUserData.username,
        email: validUserData.email,
      });

      const result = await userService.createUser(validUserData);

      expect(UserModel.prototype.getByEmail).toHaveBeenCalledWith(
        validUserData.email,
      );
      expect(UserModel.prototype.getByUsername).toHaveBeenCalledWith(
        validUserData.username,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(UserModel.prototype.createUser).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("deve lancar erro quando email ja existe", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);

      try {
        await userService.createUser(validUserData);
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        );
      }
    });

    it("deve lancar erro quando username ja existe", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest
        .spyOn(UserModel.prototype, "getByUsername")
        .mockResolvedValue(mockUser);

      try {
        await userService.createUser(validUserData);
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
        );
      }
    });

    it("deve fazer hash da senha antes de salvar", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "createUser").mockResolvedValue(mockUser);

      await userService.createUser(validUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
    });
  });

  describe("updateUser", () => {
    const updateData = {
      username: "updateduser",
    };

    it("deve atualizar usuario com sucesso", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "updateUser").mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      const result = await userService.updateUser("user-123", updateData);

      expect(UserModel.prototype.getById).toHaveBeenCalledWith("user-123");
      expect(UserModel.prototype.updateUser).toHaveBeenCalled();
      expect(result.username).toBe(updateData.username);
    });

    it("deve lancar erro quando usuario nao existe", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);

      try {
        await userService.updateUser("invalid-id", updateData);
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.NOT_FOUND);
      }
    });

    it("deve lancar erro quando novo email ja existe", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue({
        ...mockUser,
        idUser: "other-user",
      });

      try {
        await userService.updateUser("user-123", { email: "other@email.com" });
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
      }
    });

    it("deve lancar erro quando novo username ja existe", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue({
        ...mockUser,
        idUser: "other-user",
      });

      try {
        await userService.updateUser("user-123", { username: "existinguser" });
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
      }
    });

    it("deve fazer hash da nova senha ao atualizar", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "updateUser").mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");

      await userService.updateUser("user-123", { password: "newpassword123" });

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
    });
  });

  describe("deleteUser", () => {
    it("deve deletar usuario com sucesso", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "deleteUser").mockResolvedValue(mockUser);

      const result = await userService.deleteUser("user-123");

      expect(UserModel.prototype.getById).toHaveBeenCalledWith("user-123");
      expect(UserModel.prototype.deleteUser).toHaveBeenCalledWith("user-123");
      expect(result).toBeDefined();
    });

    it("deve lancar erro quando usuario nao existe", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);

      try {
        await userService.deleteUser("invalid-id");
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.NOT_FOUND);
      }
    });
  });

  describe("login", () => {
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    it("deve fazer login com sucesso usando email", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      const result = await userService.login(loginData);

      expect(UserModel.prototype.getByEmail).toHaveBeenCalledWith(
        loginData.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password,
      );
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
    });

    it("deve fazer login com sucesso usando username", async () => {
      const loginWithUsername = {
        username: "testuser",
        password: "password123",
      };
      jest
        .spyOn(UserModel.prototype, "getByUsername")
        .mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      const result = await userService.login(loginWithUsername);

      expect(UserModel.prototype.getByUsername).toHaveBeenCalledWith(
        loginWithUsername.username,
      );
      expect(result.token).toBeDefined();
    });

    it("deve lancar erro quando usuario nao encontrado", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue(null);

      try {
        await userService.login(loginData);
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        );
      }
    });

    it("deve lancar erro quando senha incorreta", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await userService.login(loginData);
        fail("Deveria ter lancado erro");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        );
      }
    });

    it("deve atualizar lastLoginDate apos login bem-sucedido", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      await userService.login(loginData);

      expect(UserModel.prototype.updateLastLogin).toHaveBeenCalledWith(
        mockUser.idUser,
      );
    });

    it("deve retornar token JWT valido", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      const result = await userService.login(loginData);

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".")).toHaveLength(3);
    });

    it("nao deve retornar senha no objeto user", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      const result = await userService.login(loginData);

      expect(result.user).not.toHaveProperty("password");
    });
  });
});
