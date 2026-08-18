import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

export function getPool(): Pool {
  if (!global._pgPool) {
    const isLocalhost =
      connectionString?.includes("localhost") ||
      connectionString?.includes("127.0.0.1");

    global._pgPool = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    global._pgPool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
    });
  }

  return global._pgPool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  return pool.query(text, params);
}
