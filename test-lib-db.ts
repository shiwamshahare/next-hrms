import { query } from "./src/lib/db";
import bcrypt from "bcryptjs";

async function verify() {
  const result = await query("SELECT id, username, email, password_hash, role FROM users WHERE username = 'admin';");
  console.log("Database user:", result.rows[0]);
  const isMatch = await bcrypt.compare("1", result.rows[0].password_hash);
  console.log("Password '1' match:", isMatch);
  process.exit(0);
}

verify().catch(console.error);
