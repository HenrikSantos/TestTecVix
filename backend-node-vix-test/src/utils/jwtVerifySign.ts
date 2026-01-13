import jwt from "jsonwebtoken";

const secret = process.env.SIGN_HASH;

type JwtPayload = Record<string, unknown>;

export const jwtVerifySign = (token: string): JwtPayload | null => {
  try {
    if (!token) return null;
    const data = jwt.verify(token, secret as string) as JwtPayload;
    return data;
  } catch {
    return null;
  }
};
