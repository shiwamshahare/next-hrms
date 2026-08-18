import { query } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function testAuth() {
  console.log("🧪 Testing Authentication with Password '1'...");

  // 1. Check user exists
  const res = await query("SELECT id, username, email, password_hash, role FROM users WHERE username = $1;", ["admin"]);
  if (res.rows.length === 0) {
    throw new Error("Admin user not found in database.");
  }

  const user = res.rows[0];
  console.log("✓ Found user in database:", { id: user.id, username: user.username, email: user.email, role: user.role });

  // 2. Check password verification
  const isValid = await bcrypt.compare("1", user.password_hash);
  if (!isValid) {
    throw new Error("Password verification failed with password '1'.");
  }
  console.log("✓ Password '1' verified successfully with bcrypt hash!");

  // 3. Generate JWT
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  console.log("✓ Generated JWT Token:", token.slice(0, 30) + "...");

  console.log("🎉 Database authentication fully verified!");
  process.exit(0);
}

testAuth().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
