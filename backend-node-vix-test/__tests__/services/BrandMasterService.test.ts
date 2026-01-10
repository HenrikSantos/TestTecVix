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
  });
});
