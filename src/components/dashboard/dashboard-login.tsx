"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

const LOGIN_HERO = "/images/audience-business.webp";
const BRAND_LOGO =
  "/images/c__Users_abuza_AppData_Roaming_Cursor_User_workspaceStorage_2e410bc3959c12af5b1f43beac22d1e6_images_logo-png-768x153-a88831ff-1cf3-42a5-b7a0-9271339be69d.webp";

export function DashboardLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      router.replace("/tb-dashboard/overview");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh bg-white">
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-12 lg:w-[42%] lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-[380px]">
          <div className="mb-10 flex items-center gap-3">
            <Image
              src={BRAND_LOGO}
              alt={`${siteConfig.name} logo`}
              width={160}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-logo-bg/70">
            {siteConfig.name}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-logo-bg sm:text-[2.15rem]">
            Dashboard Login
          </h1>
          <p className="mt-2 text-sm text-foreground/55">
            Enter your credentials to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-logo-bg outline-none transition-colors placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 pr-12 text-sm text-logo-bg outline-none transition-colors placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-foreground/45 transition-colors hover:text-logo-bg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden />
                )}
              </button>
            </label>

            {error ? (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center rounded-lg bg-logo-bg px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-[58%]">
        <Image
          src={LOGIN_HERO}
          alt=""
          fill
          priority
          sizes="58vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
