"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";
import {
  DASHBOARD_USER_ROLES,
  type CreateDashboardUserInput,
  type DashboardUserRole,
} from "@/lib/dashboard-users/types";

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateDashboardUserInput) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm text-logo-bg outline-none transition-colors placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/25";

export function CreateUserModal({
  open,
  onClose,
  onCreate,
}: CreateUserModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<DashboardUserRole>("Viewer");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setPassword("");
    setRole("Viewer");
    setShowPassword(false);
    setError(null);
    const timer = window.setTimeout(() => nameRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setError("Please fill in name, email, and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    onCreate({
      name: trimmedName,
      email: trimmedEmail,
      password,
      role,
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-logo-bg/70 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="h-1.5 w-full bg-primary" aria-hidden />

            <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
              <div>
                <h2
                  id={titleId}
                  className="text-xl font-extrabold tracking-tight text-logo-bg"
                >
                  Create user
                </h2>
                <p className="mt-1 text-sm text-foreground/55">
                  Add a dashboard account with a role.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-logo-bg/50 transition-colors hover:bg-black/[0.04] hover:text-logo-bg"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
              <label className="block">
                <span className="text-sm font-semibold text-logo-bg">Name</span>
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className={fieldClassName}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-logo-bg">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@take-bring.eu"
                  className={fieldClassName}
                />
              </label>

              <label className="relative block">
                <span className="text-sm font-semibold text-logo-bg">
                  Password
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`${fieldClassName} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute bottom-2.5 right-2 rounded-md p-1.5 text-foreground/45 hover:text-logo-bg"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-logo-bg">Role</span>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as DashboardUserRole)
                  }
                  className={fieldClassName}
                >
                  {DASHBOARD_USER_ROLES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {error ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-black/15 px-4 py-2.5 text-sm font-semibold text-logo-bg transition-colors hover:border-primary/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-logo-bg px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  Create user
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
