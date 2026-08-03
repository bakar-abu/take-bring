import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CreateDashboardUserInput, DashboardUser } from "@/lib/dashboard-users/types";
import {
  isDashboardUserRole,
  mapProfileToDashboardUser,
  type ProfileRow,
} from "@/lib/dashboard-users/profile";

function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function listProfiles(): Promise<DashboardUser[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as ProfileRow[]).map(mapProfileToDashboardUser);
}

export async function getProfileById(id: string): Promise<DashboardUser | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapProfileToDashboardUser(data as ProfileRow);
}

export async function getProfileByEmail(
  email: string,
): Promise<DashboardUser | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapProfileToDashboardUser(data as ProfileRow);
}

export async function createDashboardUser(
  input: CreateDashboardUserInput,
): Promise<DashboardUser> {
  if (!isDashboardUserRole(input.role)) {
    throw new Error("Invalid role.");
  }

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const password = input.password;

  if (!email || !name || password.length < 8) {
    throw new Error("Name, email, and password (min 8 chars) are required.");
  }

  const supabase = getSupabaseAdmin();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role: input.role },
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Could not create auth user.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: authData.user.id,
      email,
      full_name: name,
      role: input.role,
    })
    .select("id, email, full_name, role, created_at, updated_at")
    .single();

  if (profileError || !profile) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError?.message || "Could not create profile.");
  }

  return mapProfileToDashboardUser(profile as ProfileRow);
}

export async function updateDashboardUser(
  id: string,
  patch: {
    name?: string;
    role?: string;
    password?: string;
  },
): Promise<DashboardUser> {
  const supabase = getSupabaseAdmin();

  if (patch.password) {
    if (patch.password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }
    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: patch.password,
    });
    if (error) throw new Error(error.message);
  }

  const updates: { full_name?: string; role?: string } = {};
  if (typeof patch.name === "string" && patch.name.trim()) {
    updates.full_name = patch.name.trim();
  }
  if (typeof patch.role === "string") {
    if (!isDashboardUserRole(patch.role)) {
      throw new Error("Invalid role.");
    }
    updates.role = patch.role;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
  }

  const user = await getProfileById(id);
  if (!user) throw new Error("User not found.");
  return user;
}

export async function deleteDashboardUser(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  // profiles cascade via FK
}

export async function authenticateDashboardUser(
  email: string,
  password: string,
): Promise<DashboardUser | null> {
  const authClient = createAuthClient();
  const normalized = email.trim().toLowerCase();

  const { data, error } = await authClient.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (error || !data.user) return null;

  const profile = await getProfileById(data.user.id);
  if (profile) return profile;

  const metaRole = data.user.user_metadata?.role;
  const metaName = data.user.user_metadata?.full_name;
  if (typeof metaRole === "string" && isDashboardUserRole(metaRole)) {
    return {
      id: data.user.id,
      email: normalized,
      name: typeof metaName === "string" ? metaName : normalized,
      role: metaRole,
      createdAt: data.user.created_at,
    };
  }

  return null;
}
