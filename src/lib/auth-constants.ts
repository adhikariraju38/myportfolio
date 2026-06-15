// Edge-safe constants used by proxy.ts. Do NOT import postgres or bcrypt here.

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "myportfolio_session";
