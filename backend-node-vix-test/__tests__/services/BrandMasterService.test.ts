import { BrandMasterService } from "../../src/services/BrandMasterService";
import { BrandMasterModel } from "../../src/models/BrandMasterModel";

jest.mock("../../src/models/BrandMasterModel");

const MockedBrandMasterModel = BrandMasterModel as jest.MockedClass<
  typeof BrandMasterModel
>;

describe("BrandMasterService", () => {
  let brandMasterService: BrandMasterService;
  let mockGetById: jest.Mock;
  let mockUpdateBrandMaster: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetById = jest.fn();
    mockUpdateBrandMaster = jest.fn();

    MockedBrandMasterModel.prototype.getById = mockGetById;
    MockedBrandMasterModel.prototype.updateBrandMaster = mockUpdateBrandMaster;

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
  });
});
