import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side only: never import this helper into client components.
type RequiredEnvName =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "NEXT_PUBLIC_SITE_URL"
  | "ADMIN_PASSWORD";

const SUPABASE_ADMIN_ENV: RequiredEnvName[] = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

let supabaseAdmin: SupabaseClient | null = null;

export function getMissingEnv(names: RequiredEnvName[]) {
  return names.filter((name) => !process.env[name]?.trim());
}

export function requireEnv(names: RequiredEnvName[]) {
  const missing = getMissingEnv(names);

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(
        ", "
      )}. Add ${missing.length > 1 ? "them" : "it"} to .env.local.`
    );
  }

  return Object.fromEntries(
    names.map((name) => [name, process.env[name]!.trim()])
  ) as Record<RequiredEnvName, string>;
}

export function getSupabaseAdmin() {
  const env = requireEnv(SUPABASE_ADMIN_ENV);

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return supabaseAdmin;
}

export function getSiteUrl() {
  const env = requireEnv(["NEXT_PUBLIC_SITE_URL"]);
  return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}

export function getAdminPassword() {
  const env = requireEnv(["ADMIN_PASSWORD"]);
  return env.ADMIN_PASSWORD;
}

export function isAdminRequestAuthorized(request: Request) {
  const expectedPassword = getAdminPassword();
  const providedPassword = request.headers.get("x-admin-password")?.trim();

  return Boolean(providedPassword) && providedPassword === expectedPassword;
}

export function normalizeNumberPlate(value: unknown) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function jsonError(error: unknown, status = 500) {
  const message =
    error instanceof Error ? error.message : "Something went wrong. Please try again.";

  return Response.json({ error: message }, { status });
}
