import { appRequest } from "../../test-utils/appRequest";
import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";

jest.mock("../../src/controllers/UserController", () => {
  const login = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const createUser = jest.fn((_req, res) => res.status(201).json({ ok: true }));
  const listAll = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const getById = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const updateUser = jest.fn((_req, res) => res.status(200).json({ ok: true }));
  const deleteUser = jest.fn((_req, res) => res.status(200).json({ ok: true }));

  return {
    UserController: jest.fn().mockImplementation(() => ({
      login,
      createUser,
      listAll,
      getById,
      updateUser,
      deleteUser,
    })),
    __mocks: {
      login,
      createUser,
      listAll,
      getById,
      updateUser,
      deleteUser,
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

jest.mock("../../src/auth/isSelfOrIsManagerOrIsAdm", () => {
  const isSelfOrIsManagerOrIsAdm = jest.fn((_req, _res, next) => next());
  return { isSelfOrIsManagerOrIsAdm, __mocks: { isSelfOrIsManagerOrIsAdm } };
});

const { login, createUser, listAll, getById, updateUser, deleteUser } = (
  jest.requireMock("../../src/controllers/UserController") as any
).__mocks;
const { authUser } = (jest.requireMock("../../src/auth/authUser") as any)
  .__mocks;
const { isAdmin } = (jest.requireMock("../../src/auth/isAdmin") as any).__mocks;
const { isSelfOrIsManagerOrIsAdm } = (
  jest.requireMock("../../src/auth/isSelfOrIsManagerOrIsAdm") as any
).__mocks;

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER;

describe("User routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /login should call login controller", async () => {
    const response = await appRequest({
      method: "POST",
      path: `${BASE_PATH}/login`,
      body: { email: "user@example.com", password: "pass" },
    });

    expect(response.status).toBe(200);
    expect(login).toHaveBeenCalledTimes(1);
  });

  it("POST / should call createUser controller", async () => {
    const response = await appRequest({
      method: "POST",
      path: BASE_PATH,
      body: { username: "john" },
    });

    expect(response.status).toBe(201);
    expect(createUser).toHaveBeenCalledTimes(1);
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

  it("GET /:idUser should call auth and getById", async () => {
    const response = await appRequest({
      method: "GET",
      path: `${BASE_PATH}/123`,
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(getById).toHaveBeenCalledTimes(1);
  });

  it("PUT /:idUser should call auth, role guard, and updateUser", async () => {
    const response = await appRequest({
      method: "PUT",
      path: `${BASE_PATH}/123`,
      body: { fullName: "John Doe" },
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(isSelfOrIsManagerOrIsAdm).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledTimes(1);
  });

  it("DELETE /:idUser should call auth, admin guard, and deleteUser", async () => {
    const response = await appRequest({
      method: "DELETE",
      path: `${BASE_PATH}/123`,
    });

    expect(response.status).toBe(200);
    expect(authUser).toHaveBeenCalledTimes(1);
    expect(isAdmin).toHaveBeenCalledTimes(1);
    expect(deleteUser).toHaveBeenCalledTimes(1);
  });
});
