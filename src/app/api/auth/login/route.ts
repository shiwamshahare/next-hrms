import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "hrms-enterprise-secret-key-2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate inputs
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    // Query user by username or email (case-insensitive)
    const userResult = await query(
      `SELECT id, username, email, password_hash, role, full_name, is_active
       FROM users
       WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)
       LIMIT 1;`,
      [username.trim()]
    );

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials. Please verify your username and password.",
        },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: This operator account has been deactivated.",
        },
        { status: 403 }
      );
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials. Please verify your username and password.",
        },
        { status: 401 }
      );
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

    return NextResponse.json(
      {
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
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth login API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error during authentication.",
      },
      { status: 500 }
    );
  }
}
