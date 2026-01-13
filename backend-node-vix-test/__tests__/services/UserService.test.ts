import { UserService } from "../../src/services/UserService";
import { UserModel } from "../../src/models/UserModel";
import { BrandMasterModel } from "../../src/models/BrandMasterModel";
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
    jest.spyOn(BrandMasterModel.prototype, "getById").mockResolvedValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getById", () => {
    it("should return user when found", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);

      const result = await userService.getById("user-123");

      expect(UserModel.prototype.getById).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(mockUser);
    });

    it("should throw NOT_FOUND when user does not exist", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);

      try {
        await userService.getById("invalid-id");
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.NOT_FOUND);
        expect((error as AppError).message).toBe(ERROR_MESSAGE.USER_NOT_FOUND);
      }
    });

    it("should throw when user belongs to another brand", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue({
        ...mockUser,
        idBrandMaster: 2,
      });

      try {
        await userService.getById("user-123", {
          idBrandMaster: 1,
        } as any);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.FORBIDDEN);
      }
    });
  });

  describe("listAll", () => {
    it("should return user list", async () => {
      const mockList = { totalCount: 1, result: [mockUser] };
      jest.spyOn(UserModel.prototype, "listAll").mockResolvedValue(mockList);

      const result = await userService.listAll({});

      expect(UserModel.prototype.listAll).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });

    it("should pass query parameters to the model", async () => {
      const mockList = { totalCount: 0, result: [] };
      jest.spyOn(UserModel.prototype, "listAll").mockResolvedValue(mockList);

      const query = { limit: "10", page: "0" };
      await userService.listAll(query);

      expect(UserModel.prototype.listAll).toHaveBeenCalled();
    });

    it("should restrict listAll to user's brand", async () => {
      const mockList = { totalCount: 0, result: [] };
      jest.spyOn(UserModel.prototype, "listAll").mockResolvedValue(mockList);

      await userService.listAll({}, { idBrandMaster: 1 } as any);

      expect(UserModel.prototype.listAll).toHaveBeenCalledWith(
        expect.objectContaining({ idBrandMaster: 1 }),
      );
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

    it("should create user successfully", async () => {
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

    it("should block creation for member users", async () => {
      try {
        await userService.createUser(validUserData, { role: "member" } as any);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.FORBIDDEN);
      }
    });

    it("should override idBrandMaster when user has brand", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "createUser").mockResolvedValue(mockUser);

      await userService.createUser({ ...validUserData, idBrandMaster: 999 }, {
        idBrandMaster: 1,
      } as any);

      expect(UserModel.prototype.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ idBrandMaster: 1 }),
      );
    });

    it("should throw when email already exists", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);

      try {
        await userService.createUser(validUserData);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        );
      }
    });

    it("should throw when username already exists", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest
        .spyOn(UserModel.prototype, "getByUsername")
        .mockResolvedValue(mockUser);

      try {
        await userService.createUser(validUserData);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
        );
      }
    });

    it("should hash password before saving", async () => {
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

    it("should update user successfully", async () => {
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

    it("should block member updating another user", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);

      try {
        await userService.updateUser("user-123", updateData, {
          idUser: "other-user",
          role: "member",
        } as any);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.FORBIDDEN);
      }
    });

    it("should throw when user does not exist", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);

      try {
        await userService.updateUser("invalid-id", updateData);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.NOT_FOUND);
      }
    });

    it("should throw when new email already exists", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue({
        ...mockUser,
        idUser: "other-user",
      });

      try {
        await userService.updateUser("user-123", { email: "other@email.com" });
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
      }
    });

    it("should throw when new username already exists", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue({
        ...mockUser,
        idUser: "other-user",
      });

      try {
        await userService.updateUser("user-123", { username: "existinguser" });
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.CONFLICT);
      }
    });

    it("should hash new password on update", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "updateUser").mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");

      await userService.updateUser("user-123", { password: "newpassword123" });

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
    });

    it("should not allow non-admin to change role and status", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "updateUser").mockResolvedValue(mockUser);

      await userService.updateUser(
        "user-123",
        {
          role: "admin",
          idBrandMaster: 99,
          isActive: false,
        },
        { role: "manager", idBrandMaster: 1 } as any,
      );

      expect(UserModel.prototype.updateUser).toHaveBeenCalledWith(
        "user-123",
        expect.not.objectContaining({
          role: "admin",
          idBrandMaster: 99,
          isActive: false,
        }),
      );
    });

    it("should not allow admin with brand to change idBrandMaster", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "updateUser").mockResolvedValue(mockUser);

      await userService.updateUser("user-123", { idBrandMaster: 99 }, {
        role: "admin",
        idBrandMaster: 1,
      } as any);

      expect(UserModel.prototype.updateUser).toHaveBeenCalledWith(
        "user-123",
        expect.not.objectContaining({ idBrandMaster: 99 }),
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(mockUser);
      jest.spyOn(UserModel.prototype, "deleteUser").mockResolvedValue(mockUser);

      const result = await userService.deleteUser("user-123");

      expect(UserModel.prototype.getById).toHaveBeenCalledWith("user-123");
      expect(UserModel.prototype.deleteUser).toHaveBeenCalledWith("user-123");
      expect(result).toBeDefined();
    });

    it("should block delete for manager", async () => {
      try {
        await userService.deleteUser("user-123", { role: "manager" } as any);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.FORBIDDEN);
      }
    });

    it("should throw when user does not exist", async () => {
      jest.spyOn(UserModel.prototype, "getById").mockResolvedValue(null);

      try {
        await userService.deleteUser("invalid-id");
        fail("Expected to throw an error");
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

    it("should log in successfully using email", async () => {
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

    it("should log in successfully using username", async () => {
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

    it("should throw when user is not found", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "getByUsername").mockResolvedValue(null);

      try {
        await userService.login(loginData);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        );
      }
    });

    it("should throw when password is incorrect", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await userService.login(loginData);
        fail("Expected to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(STATUS_CODE.UNAUTHORIZED);
        expect((error as AppError).message).toBe(
          ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        );
      }
    });

    it("should update lastLoginDate after successful login", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      await userService.login(loginData);

      expect(UserModel.prototype.updateLastLogin).toHaveBeenCalledWith(
        mockUser.idUser,
      );
    });

    it("should return a valid JWT token", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      const result = await userService.login(loginData);

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".")).toHaveLength(3);
    });

    it("should not return password in user object", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);

      const result = await userService.login(loginData);

      expect(result.user).not.toHaveProperty("password");
    });

    it("should return brandMaster contacts when present", async () => {
      jest.spyOn(UserModel.prototype, "getByEmail").mockResolvedValue(mockUser);
      jest
        .spyOn(UserModel.prototype, "updateLastLogin")
        .mockResolvedValue(mockUser);
      (BrandMasterModel.prototype.getById as jest.Mock).mockResolvedValue({
        emailContact: "brand@example.com",
        smsContact: "(11) 98888-8888",
        timezone: "America/Sao_Paulo",
      } as any);

      const result = await userService.login(loginData);

      expect(result.brandMaster).toEqual({
        emailContact: "brand@example.com",
        smsContact: "(11) 98888-8888",
        timezone: "America/Sao_Paulo",
      });
    });
  });
});
