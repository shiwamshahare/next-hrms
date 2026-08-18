import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db";
import { AuthRequest } from "../middleware/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "hrms-enterprise-secret-key-2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate request inputs
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
      return;
    }

    // Query user by username or email (case-insensitive)
    const userResult = await query(
      `SELECT id, username, email, password_hash, role, full_name, is_active
       FROM users
       WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)
       LIMIT 1;`,
      [username.trim()]
    );

    if (userResult.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your username and password.",
      });
      return;
    }

    const user = userResult.rows[0];

    // Verify account active status
    if (!user.is_active) {
      res.status(403).json({
        success: false,
        message: "Access Denied: This operator account has been deactivated.",
      });
      return;
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your username and password.",
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Return sanitized response
    res.status(200).json({
      success: true,
      message: "Authentication successful. Access granted.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userResult = await query(
      `SELECT id, username, email, role, full_name, created_at
       FROM users
       WHERE id = $1
       LIMIT 1;`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const user = userResult.rows[0];

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user session.",
    });
  }
};
