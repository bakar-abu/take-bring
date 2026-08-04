export const DASHBOARD_PATH = "/tb-dashboard";

/** @deprecated Prefer ACCESS / REFRESH cookies */
export const DASHBOARD_SESSION_COOKIE = "tb_dashboard_session";

export const DASHBOARD_ACCESS_COOKIE = "tb_dashboard_access";
export const DASHBOARD_REFRESH_COOKIE = "tb_dashboard_refresh";

/** Access JWT lifetime — 1 day */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

/** Refresh JWT lifetime — 7 days */
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** @deprecated use REFRESH_TOKEN_MAX_AGE_SECONDS */
export const SESSION_MAX_AGE_SECONDS = REFRESH_TOKEN_MAX_AGE_SECONDS;
