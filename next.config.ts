import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["pg", "pg-hstore", "bcryptjs", "jsonwebtoken"],
};

export default nextConfig;
