import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devKey";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.cookies.token;

  if (!authToken) {
    return res.status(401).json({ message: "auth token required" });
  }

  try {
    const user = verify(authToken, JWT_SECRET);
    req.user = user;

    next();
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
}
