import { JwtPayload } from "@/modules/auth/auth.types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}



export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}
