import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hrms-enterprise-secret-key-2026";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access Denied: Missing Authorization Header",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Access Denied: Invalid or Expired Token",
    });
  }
};
