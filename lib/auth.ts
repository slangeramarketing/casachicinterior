import jwt, { JwtPayload, Secret , SignOptions   } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d";


export function signToken(payload:string | object | Buffer) {
  if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: EXPIRES_IN 
  });
}

export function verifyToken(token:string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
