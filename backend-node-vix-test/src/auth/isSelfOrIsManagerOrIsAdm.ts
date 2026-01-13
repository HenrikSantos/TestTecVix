import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { IJwtPayload } from "../utils/jwt";

export const isSelfOrIsManagerOrIsAdm = (
  req: CustomRequest<IJwtPayload>,
  _res: Response,
  next: NextFunction,
) => {
  const user = req.user as IJwtPayload;
  const idUserFromParams = req.params.idUser;

  const isSelf = user.idUser === idUserFromParams;
  const isManagerOrAdmin = user.role === "admin" || user.role === "manager";

  if (!isSelf && !isManagerOrAdmin) {
    throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
  }
  return next();
};
