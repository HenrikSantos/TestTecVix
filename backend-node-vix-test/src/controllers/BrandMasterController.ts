import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { BrandMasterService } from "../services/BrandMasterService";
import { user } from "@prisma/client";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";

export class BrandMasterController {
  constructor() {}
  private brandMasterService = new BrandMasterService();

  async getSelf(req: CustomRequest<unknown>, res: Response) {
    const host = req.headers.host || req.headers.origin || "";
    const domain = host.replace(/^https?:\/\//, "").split(":")[0];

    if (!domain) {
      return res.status(STATUS_CODE.OK).json(null);
    }

    const result = await this.brandMasterService.getSelf(domain);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.getById(Number(idBrandMaster));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.brandMasterService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async createNewBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const result = await this.brandMasterService.createNewBrandMaster(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async updateBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const { idBrandMaster } = req.params;
    const id = user.idBrandMaster ? user.idBrandMaster : Number(idBrandMaster);

    if (isNaN(id)) {
      throw new AppError("ID inválido", STATUS_CODE.BAD_REQUEST);
    }

    const result = await this.brandMasterService.updateBrandMaster(
      id,
      req.body,
      user,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async deleteBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.deleteBrandMaster(
      Number(idBrandMaster),
    );
    return res.status(STATUS_CODE.OK).json(result);
  }
}
