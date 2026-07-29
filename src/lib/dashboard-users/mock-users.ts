import type { DashboardUser } from "@/lib/dashboard-users/types";

/**
 * MOCK DATA — for UI visibility only.
 * When integrating / going live: delete this file and remove all imports of `MOCK_USERS`.
 */
export const MOCK_USERS: DashboardUser[] = [
  {
    id: "mock-user-001",
    name: "Admin TakeBring",
    email: "admin@take-bring.eu",
    role: "Admin",
    createdAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "mock-user-002",
    name: "Maria Klein",
    email: "maria.klein@take-bring.eu",
    role: "Content Manager",
    createdAt: "2026-02-04T11:20:00.000Z",
  },
  {
    id: "mock-user-003",
    name: "Jonas Richter",
    email: "jonas.richter@take-bring.eu",
    role: "Viewer",
    createdAt: "2026-03-18T14:45:00.000Z",
  },
  {
    id: "mock-user-004",
    name: "Elena Popescu",
    email: "elena.popescu@take-bring.eu",
    role: "Content Manager",
    createdAt: "2026-04-02T08:15:00.000Z",
  },
  {
    id: "mock-user-005",
    name: "Thomas Weber",
    email: "thomas.weber@take-bring.eu",
    role: "Viewer",
    createdAt: "2026-05-21T16:30:00.000Z",
  },
  {
    id: "mock-user-006",
    name: "Sofia Rossi",
    email: "sofia.rossi@take-bring.eu",
    role: "Admin",
    createdAt: "2026-06-09T10:05:00.000Z",
  },
];
