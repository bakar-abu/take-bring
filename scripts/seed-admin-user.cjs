/**
 * Apply users migration + seed Admin (custom auth, bcrypt).
 *
 * Usage: node scripts/seed-admin-user.cjs
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) throw new Error("Missing .env");
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function runMigrationIfPossible() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.log(
      "DATABASE_URL not set — run supabase/migrations/002_users.sql in SQL Editor if needed.",
    );
    return;
  }

  let pg;
  try {
    pg = require("pg");
  } catch {
    console.log("pg not installed — skip SQL migrate.");
    return;
  }

  const sqlPath = path.join(
    __dirname,
    "..",
    "supabase",
    "migrations",
    "002_users.sql",
  );
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied 002_users.sql");
  } finally {
    await client.end();
  }
}

async function seedAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase URL or service role key in .env");
  }

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@take-bring.eu")
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "12345678";
  const fullName = process.env.SEED_ADMIN_NAME || "Admin";
  const role = "Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (findError) {
    throw new Error(
      `users table lookup failed: ${findError.message}. Apply 002_users.sql first.`,
    );
  }

  if (existing?.id) {
    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        role,
        password_hash: passwordHash,
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    console.log("Updated admin user:", email, existing.id);
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      full_name: fullName,
      role,
      password_hash: passwordHash,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Could not insert admin user.");
  }

  console.log("Created admin user:", { email, role, id: data.id });
}

async function main() {
  loadEnv();
  await runMigrationIfPossible();
  await seedAdmin();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
