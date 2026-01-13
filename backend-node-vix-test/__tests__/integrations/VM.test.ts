import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";
import { VMListMock } from "../__mocks__/VMList";
import { appRequest } from "../../test-utils/appRequest";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.VM;

// Mock middlewares de autenticação
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

jest.mock("../../src/auth/isAdmin", () => ({
  isAdmin: (req: any, res: any, next: any) => {
    next();
  },
}));

const mockVM = {
  idVM: 1,
  vmName: "Test VM",
  vCPU: 2,
  ram: 8,
  disk: 50,
  hasBackup: false,
  idBrandMaster: 1,
  status: "RUNNING",
  os: "ubuntu2404",
  pass: "StrongPassword123!",
  location: "usa_miami",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  brandMaster: {
    brandName: "Test Company",
    brandLogo: null,
  },
};

type VMListResponse = {
  result: typeof VMListMock;
  totalCount: number;
};

type VMResponse = typeof mockVM | null;

describe("Testing VM API - listAll", () => {
  it("should return a list of VMs", async () => {
    // @ts-ignore
    prismaMock.vM.findMany.mockResolvedValue(VMListMock);
    prismaMock.vM.count.mockResolvedValue(2);

    const response = await appRequest<VMListResponse>({
      method: "GET",
      path: BASE_PATH,
    });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveLength(2);
    expect(response.body.totalCount).toBe(2);
  });

  it("should return an empty list when no VMs match", async () => {
    prismaMock.vM.findMany.mockResolvedValue([]);
    prismaMock.vM.count.mockResolvedValue(0);

    const response = await appRequest<VMListResponse>({
      method: "GET",
      path: BASE_PATH,
    });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveLength(0);
    expect(response.body.totalCount).toBe(0);
  });

  it("should filter by status", async () => {
    prismaMock.vM.findMany.mockResolvedValue([]);
    prismaMock.vM.count.mockResolvedValue(0);

    const response = await appRequest<VMListResponse>({
      method: "GET",
      path: `${BASE_PATH}?status=RUNNING`,
    });

    expect(response.status).toBe(200);
    expect(prismaMock.vM.findMany).toHaveBeenCalled();
  });

  it("should filter by search term", async () => {
    prismaMock.vM.findMany.mockResolvedValue([]);
    prismaMock.vM.count.mockResolvedValue(0);

    const response = await appRequest<VMListResponse>({
      method: "GET",
      path: `${BASE_PATH}?search=test`,
    });

    expect(response.status).toBe(200);
    expect(prismaMock.vM.findMany).toHaveBeenCalled();
  });
});

describe("Testing VM API - getById", () => {
  it("should return a specific VM", async () => {
    // @ts-ignore
    prismaMock.vM.findUnique.mockResolvedValue(mockVM);

    const response = await appRequest<VMResponse>({
      method: "GET",
      path: `${BASE_PATH}/1`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("idVM", 1);
    expect(response.body).toHaveProperty("vmName", "Test VM");
  });

  it("should return null when VM not found", async () => {
    prismaMock.vM.findUnique.mockResolvedValue(null);

    const response = await appRequest<VMResponse>({
      method: "GET",
      path: `${BASE_PATH}/999`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });
});

describe("Testing VM API - updateVM", () => {
  it("should return the updated VM", async () => {
    const updatedVM = { ...mockVM, vmName: "Updated VM Name" };
    // @ts-ignore
    prismaMock.vM.findUnique.mockResolvedValue(mockVM);
    // @ts-ignore
    prismaMock.vM.update.mockResolvedValue(updatedVM);

    const response = await appRequest<VMResponse>({
      method: "PUT",
      path: `${BASE_PATH}/1`,
      body: { vmName: "Updated VM Name" },
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("vmName", "Updated VM Name");
  });

  it("should update VM status", async () => {
    const stoppedVM = { ...mockVM, status: "STOPPED" };
    // @ts-ignore
    prismaMock.vM.findUnique.mockResolvedValue(mockVM);
    // @ts-ignore
    prismaMock.vM.update.mockResolvedValue(stoppedVM);

    const response = await appRequest<VMResponse>({
      method: "PUT",
      path: `${BASE_PATH}/1`,
      body: { status: "STOPPED" },
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "STOPPED");
  });

  it("should return 404 when VM not found", async () => {
    prismaMock.vM.findUnique.mockResolvedValue(null);

    const response = await appRequest({
      method: "PUT",
      path: `${BASE_PATH}/999`,
      body: { vmName: "test" },
    });

    expect(response.status).toBe(404);
  });
});

describe("Testing VM API - deleteVM", () => {
  it("should soft delete VM (set deletedAt)", async () => {
    const deletedVM = { ...mockVM, deletedAt: new Date() };
    // @ts-ignore
    prismaMock.vM.findUnique.mockResolvedValue(mockVM);
    // @ts-ignore
    prismaMock.vM.update.mockResolvedValue(deletedVM);

    const response = await appRequest<VMResponse>({
      method: "DELETE",
      path: `${BASE_PATH}/1`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("deletedAt");
  });

  it("should return 404 when VM not found", async () => {
    prismaMock.vM.findUnique.mockResolvedValue(null);

    const response = await appRequest<VMResponse>({
      method: "DELETE",
      path: `${BASE_PATH}/999`,
    });

    expect(response.status).toBe(404);
  });
});
