import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

const secret = process.env.JWT_SECRET || "JWT_SECRET";

export interface IJwtPayload {
  idUser: string;
  email: string;
  role: string;
  idBrandMaster: number | null;
}

export const genToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): IJwtPayload => {
  try {
    const decoded = jwt.verify(token, secret) as IJwtPayload;
    return decoded;
  } catch {
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
};
