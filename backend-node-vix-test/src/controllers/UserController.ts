import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { UserService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";

export class UserController {
  private userService = new UserService();

  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const result = await this.userService.getById(idUser);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async createUser(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.createUser(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async updateUser(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const result = await this.userService.updateUser(idUser, req.body);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async deleteUser(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const result = await this.userService.deleteUser(idUser);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async login(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.login(req.body);
    return res.status(STATUS_CODE.OK).json(result);
  }
}
