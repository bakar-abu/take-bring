/**
 * Apply profiles migration + seed Admin user.
 *
 * Usage: node scripts/seed-admin-user.cjs
 *
 * Requires in .env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DATABASE_URL  (optional — for SQL migration; or run 001_profiles.sql in SQL Editor first)
 *   SEED_ADMIN_EMAIL (default admin@take-bring.eu)
 *   SEED_ADMIN_PASSWORD (default 12345678)
 *   SEED_ADMIN_NAME (default Admin)
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing .env");
  }
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
    console.log("DATABASE_URL not set — skip SQL migrate (run 001_profiles.sql in Supabase SQL Editor if needed).");
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
    "001_profiles.sql",
  );
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied 001_profiles.sql");
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

  const email = (
    process.env.SEED_ADMIN_EMAIL || "admin@take-bring.eu"
  )
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "12345678";
  const fullName = process.env.SEED_ADMIN_NAME || "Admin";
  const role = "Admin";

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: listed, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listError) throw new Error(listError.message);

  let user = listed.users.find((u) => u.email?.toLowerCase() === email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });
    if (error || !data.user) {
      throw new Error(error?.message || "createUser failed");
    }
    user = data.user;
    console.log("Created auth user:", email);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });
    if (error) throw new Error(error.message);
    console.log("Updated existing auth user password/metadata:", email);
  }

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      full_name: fullName,
      role,
    },
    { onConflict: "id" },
  );

  if (upsertError) {
    throw new Error(
      `Profile upsert failed: ${upsertError.message}. Ensure 001_profiles.sql has been applied.`,
    );
  }

  console.log("Admin profile ready:", { email, role, id: user.id });
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
