import { Pool, type QueryResultRow } from "pg";

const globalForSql = globalThis as unknown as {
  sqlPool: Pool | undefined;
};

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL/DIRECT_URL in environment.");
  }
  return connectionString;
}

function createPool() {
  return new Pool({
    connectionString: getConnectionString(),
    max: 10,
    ssl: { rejectUnauthorized: false },
  });
}

function getPool() {
  if (!globalForSql.sqlPool) {
    globalForSql.sqlPool = createPool();
  }
  return globalForSql.sqlPool;
}

export async function sqlQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  const pool = getPool();
  return pool.query<T>(text, values);
}
