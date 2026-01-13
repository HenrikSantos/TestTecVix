import { appRequest } from "../../test-utils/appRequest";
import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";

jest.mock("../../src/controllers/BrandMasterController", () => {
  const getSelf = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const getById = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const listAll = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const createNewBrandMaster = jest.fn((_req, res) =>
    res.status(201).json({ ok: true }),
  );
  const updateBrandMaster = jest.fn((_req, res) =>
    res.status(200).json({ ok: true }),
  );
  const deleteBrandMaster = jest.fn((_req, res) =>
    res.status(200).json({ ok: true }),
  );

  return {
    BrandMasterController: jest.fn().mockImplementation(() => ({
      getSelf,
      getById,
      listAll,
      createNewBrandMaster,
      updateBrandMaster,
      deleteBrandMaster,
    })),
    __mocks: {
      getSelf,
      getById,
      listAll,
      createNewBrandMaster,
      updateBrandMaster,
      deleteBrandMaster,
    },
  };
});

jest.mock("../../src/auth/authUser", () => {
  const authUser = jest.fn((req, _res, next) => {
    req.user = { idUser: "user-1", role: "admin" };
    next();
  });
  return { authUser, __mocks: { authUser } };
});

jest.mock("../../src/auth/isAdmin", () => {
  const isAdmin = jest.fn((_req, _res, next) => next());
  return { isAdmin, __mocks: { isAdmin } };
});

jest.mock("../../src/auth/isManagerOrIsAdmin", () => {
  const isManagerOrIsAdmin = jest.fn((_req, _res, next) => next());
  return { isManagerOrIsAdmin, __mocks: { isManagerOrIsAdmin } };
});

const {
  getSelf,
  getById,
  listAll,
  createNewBrandMaster,
  updateBrandMaster,
  deleteBrandMaster,
} = (jest.requireMock("../../src/controllers/BrandMasterController") as any)
  .__mocks;
const { authUser } = (jest.requireMock("../../src/auth/authUser") as any)
  .__mocks;
const { isAdmin } = (jest.requireMock("../../src/auth/isAdmin") as any).__mocks;
const { isManagerOrIsAdmin } = (
  jest.requireMock("../../src/auth/isManagerOrIsAdmin") as any
).__mocks;

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.BRANDMASTER;

describe("BrandMaster routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /self should call getSelf", async () => {
    const response = await appRequest({
      method: "GET",
      path: `${BASE_PATH}/self`,
    });

    expect(response.status).toBe(200);
    expect(getSelf).toHaveBeenCalledTimes(1);
  });

  it("GET /:idBrandMaster should call auth and getById", async () => {
    const response = await appRequest({
      method: "GET",
      path: `${BASE_PATH}/1`,
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(getById).toHaveBeenCalledTimes(1);
  });

  it("GET / should call auth and listAll", async () => {
    const response = await appRequest({
      method: "GET",
      path: BASE_PATH,
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(listAll).toHaveBeenCalledTimes(1);
  });

  it("POST / should call auth, manager/admin guard, and createNewBrandMaster", async () => {
    const response = await appRequest({
      method: "POST",
      path: BASE_PATH,
      body: { brandName: "Test" },
    });

    expect(response.status).toBe(201);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(isManagerOrIsAdmin).toHaveBeenCalledTimes(1);
    expect(createNewBrandMaster).toHaveBeenCalledTimes(1);
  });

  it("PUT /:idBrandMaster should call auth, manager/admin guard, and updateBrandMaster", async () => {
    const response = await appRequest({
      method: "PUT",
      path: `${BASE_PATH}/1`,
      body: { brandName: "Updated" },
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(isManagerOrIsAdmin).toHaveBeenCalledTimes(1);
    expect(updateBrandMaster).toHaveBeenCalledTimes(1);
  });

  it("DELETE /:idBrandMaster should call auth, admin guard, and deleteBrandMaster", async () => {
    const response = await appRequest({
      method: "DELETE",
      path: `${BASE_PATH}/1`,
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(isAdmin).toHaveBeenCalledTimes(1);
    expect(deleteBrandMaster).toHaveBeenCalledTimes(1);
  });
});
