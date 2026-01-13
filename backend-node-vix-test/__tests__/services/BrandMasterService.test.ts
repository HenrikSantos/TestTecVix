import { BrandMasterService } from "../../src/services/BrandMasterService";
import { BrandMasterModel } from "../../src/models/BrandMasterModel";
import { UserModel } from "../../src/models/UserModel";
import bcrypt from "bcryptjs";

jest.mock("../../src/models/BrandMasterModel");
jest.mock("../../src/models/UserModel");
jest.mock("bcryptjs");

const MockedBrandMasterModel = BrandMasterModel as jest.MockedClass<
  typeof BrandMasterModel
>;
const MockedUserModel = UserModel as jest.MockedClass<typeof UserModel>;

describe("BrandMasterService", () => {
  let brandMasterService: BrandMasterService;
  let mockGetById: jest.Mock;
  let mockUpdateBrandMaster: jest.Mock;
  let mockGetAdminByBrandMasterId: jest.Mock;
  let mockGetByEmail: jest.Mock;
  let mockGetByUsername: jest.Mock;
  let mockUpdateUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetById = jest.fn();
    mockUpdateBrandMaster = jest.fn();
    mockGetAdminByBrandMasterId = jest.fn();
    mockGetByEmail = jest.fn();
    mockGetByUsername = jest.fn();
    mockUpdateUser = jest.fn();

    MockedBrandMasterModel.prototype.getById = mockGetById;
    MockedBrandMasterModel.prototype.updateBrandMaster = mockUpdateBrandMaster;
    MockedUserModel.prototype.getAdminByBrandMasterId =
      mockGetAdminByBrandMasterId;
    MockedUserModel.prototype.getByEmail = mockGetByEmail;
    MockedUserModel.prototype.getByUsername = mockGetByUsername;
    MockedUserModel.prototype.updateUser = mockUpdateUser;

    brandMasterService = new BrandMasterService();
  });

  describe("updateBrandMaster", () => {
    it("updateBrandMaster should be called", async () => {
      const idBrandMaster = 1;
      mockGetById.mockResolvedValue({ idBrandMaster: 1 });
      mockUpdateBrandMaster.mockResolvedValue({});

      await brandMasterService.updateBrandMaster(idBrandMaster, {}, {
        idBrandMaster: 1,
      } as any);

      expect(mockUpdateBrandMaster).toHaveBeenCalled();
    });

    it("updateBrandMaster should not be called when brand not found", async () => {
      const idBrandMaster = 1;
      mockGetById.mockResolvedValue(null);

      await expect(
        brandMasterService.updateBrandMaster(idBrandMaster, {}, {
          idBrandMaster: 1,
        } as any),
      ).rejects.toBeTruthy();

      expect(mockUpdateBrandMaster).not.toHaveBeenCalled();
    });
    it("updateBrandMaster should not allow non-admin to update logo", async () => {
      const idBrandMaster = 1;
      mockGetById.mockResolvedValue({
        idBrandMaster: 1,
        brandLogo: "old-logo.png",
      });

      try {
        await brandMasterService.updateBrandMaster(
          idBrandMaster,
          { brandLogo: "new-logo.png" },
          { idBrandMaster: 1, role: "member" } as any,
        );
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBe(
          "Apenas administradores podem alterar a logo da empresa",
        );
      }

      expect(mockUpdateBrandMaster).not.toHaveBeenCalled();
    });

    it("updateBrandMaster should remove contact fields for non-brand-admin", async () => {
      const idBrandMaster = 1;
      mockGetById.mockResolvedValue({
        idBrandMaster: 1,
        brandLogo: "old-logo.png",
      });
      mockUpdateBrandMaster.mockResolvedValue({
        idBrandMaster: 1,
        brandName: "Updated",
      });

      await brandMasterService.updateBrandMaster(
        idBrandMaster,
        {
          brandName: "Updated",
          emailContact: "test@example.com",
          smsContact: "(11) 99999-9999",
          timezone: "America/Sao_Paulo",
        },
        { idBrandMaster: 1, role: "manager" } as any,
      );

      expect(mockUpdateBrandMaster).toHaveBeenCalledWith(
        idBrandMaster,
        expect.not.objectContaining({
          emailContact: "test@example.com",
          smsContact: "(11) 99999-9999",
          timezone: "America/Sao_Paulo",
        }),
      );
      expect(mockUpdateBrandMaster).toHaveBeenCalledWith(
        idBrandMaster,
        expect.objectContaining({ brandName: "Updated" }),
      );
    });

    it("updateBrandMaster should allow admin to update logo", async () => {
      const idBrandMaster = 1;
      mockGetById.mockResolvedValue({
        idBrandMaster: 1,
        brandLogo: "old-logo.png",
      });
      mockUpdateBrandMaster.mockResolvedValue({
        idBrandMaster: 1,
        brandLogo: "new-logo.png",
      });

      const result = await brandMasterService.updateBrandMaster(
        idBrandMaster,
        { brandLogo: "new-logo.png" },
        { idBrandMaster: 1, role: "admin" } as any,
      );

      expect(mockUpdateBrandMaster).toHaveBeenCalled();
      expect(result.brandLogo).toBe("new-logo.png");
    });

    it("updateBrandMaster should update admin user when admName changes", async () => {
      const idBrandMaster = 1;
      const existingAdmin = {
        idUser: "admin-1",
        username: "old.admin",
        email: "admin@example.com",
      };

      mockGetById.mockResolvedValue({
        idBrandMaster: 1,
        brandLogo: "old-logo.png",
      });
      mockGetAdminByBrandMasterId.mockResolvedValue(existingAdmin);
      mockGetByUsername.mockResolvedValue(null);
      mockUpdateUser.mockResolvedValue({
        idUser: existingAdmin.idUser,
        username: "new.admin",
        fullName: "New Admin",
      });
      mockUpdateBrandMaster.mockResolvedValue({
        idBrandMaster: 1,
      });

      const result = await brandMasterService.updateBrandMaster(
        idBrandMaster,
        { admName: "New Admin" },
        { idBrandMaster: 1, role: "admin" } as any,
      );

      expect(mockUpdateUser).toHaveBeenCalledWith(existingAdmin.idUser, {
        fullName: "New Admin",
        username: "new.admin",
      });
      expect(result.adminUser).toBeTruthy();
    });

    it("updateBrandMaster should forbid member updates", async () => {
      const idBrandMaster = 1;
      mockGetById.mockResolvedValue({
        idBrandMaster: 1,
        brandLogo: "old-logo.png",
      });

      await expect(
        brandMasterService.updateBrandMaster(
          idBrandMaster,
          { brandName: "Updated" },
          { idBrandMaster: 1, role: "member" } as any,
        ),
      ).rejects.toBeTruthy();
      expect(mockUpdateBrandMaster).not.toHaveBeenCalled();
    });
  });
});
