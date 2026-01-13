import { prismaMock } from "../singleton";
import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";
import { appRequest } from "../../test-utils/appRequest";

// Mock middlewares
jest.mock("../../src/auth/authUser", () => ({
  authUser: (req: any, res: any, next: any) => {
    req.user = { idUser: "user-1", role: "admin", idBrandMaster: 1 };
    next();
  },
}));

jest.mock("../../src/auth/isManagerOrIsAdmin", () => ({
  isManagerOrIsAdmin: (req: any, res: any, next: any) => {
    next();
  },
}));

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.VM;

describe("VM Creation Integration", () => {
  it("should create a VM successfully", async () => {
    const payload = {
      vmName: "Test VM",
      vCPU: 2,
      ram: 4,
      disk: 50,
      hasBackup: true,
      os: "ubuntu2404",
      pass: "StrongPassword123!",
      location: "usa_miami",
    };

    const mockCreatedVM = {
      idVM: 1,
      ...payload,
      status: "RUNNING",
      idBrandMaster: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      brandMaster: null,
    };

    // @ts-ignore
    prismaMock.vM.create.mockResolvedValue(mockCreatedVM);

    const response = await appRequest({
      method: "POST",
      path: BASE_PATH,
      body: payload,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("idVM", 1);
    expect(response.body).toHaveProperty("vmName", "Test VM");
    expect(response.body).toHaveProperty("os", "ubuntu2404");

    expect(prismaMock.vM.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          vmName: "Test VM",
          os: "ubuntu2404",
          pass: "StrongPassword123!",
          location: "usa_miami",
        }),
      }),
    );
  });

  it("should return validation error for missing required fields", async () => {
    const payload = {
      vmName: "Invalid VM",
      // Missing vCPU, ram, etc.
    };

    // Zod validation should fail before hitting prisma
    const response = await appRequest({
      method: "POST",
      path: BASE_PATH,
      body: payload,
    });

    expect(response.status).toBe(400);
  });
});
