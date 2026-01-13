import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";
import { isAdmin } from "../auth/isAdmin";
import { isSelfOrIsManagerOrIsAdm } from "../auth/isSelfOrIsManagerOrIsAdm";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER; // /api/v1/user

const userRoutes = Router();

export const makeUserController = () => {
  return new UserController();
};

const userController = makeUserController();

// Rotas públicas (autenticação)
userRoutes.post(`${BASE_PATH}/login`, async (req, res) => {
  await userController.login(req, res);
});

// Rota de registro (pública)
userRoutes.post(`${BASE_PATH}`, async (req, res) => {
  await userController.createUser(req, res);
});

// Rotas protegidas
userRoutes.get(`${BASE_PATH}`, authUser, async (req, res) => {
  await userController.listAll(req, res);
});

userRoutes.get(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.getById(req, res);
});

userRoutes.put(
  `${BASE_PATH}/:idUser`,
  authUser,
  isSelfOrIsManagerOrIsAdm,
  async (req, res) => {
    await userController.updateUser(req, res);
  },
);

userRoutes.delete(
  `${BASE_PATH}/:idUser`,
  authUser,
  isAdmin,
  async (req, res) => {
    await userController.deleteUser(req, res);
  },
);

export { userRoutes };
