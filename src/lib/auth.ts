import "server-only";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { User, Session, type UserDoc, type SessionDoc } from "@/lib/db/models";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

export { SESSION_COOKIE_NAME };

const BCRYPT_ROUNDS = 12;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const DUMMY_HASH = "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function constantTimeVerifyPassword(
  plain: string,
  hash: string | null,
): Promise<boolean> {
  if (!hash) {
    await bcrypt.compare(plain, DUMMY_HASH);
    return false;
  }
  return bcrypt.compare(plain, hash);
}

function generateToken(): string {
  return randomBytes(48).toString("hex");
}

export interface CreatedSession {
  token: string;
  expiresAt: Date;
  sessionId: string;
}

export async function createSession(
  userId: string,
  meta: { userAgent?: string | null; ipAddress?: string | null } = {},
): Promise<CreatedSession> {
  await getDb();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const session = await Session.create({
    userId,
    token,
    expiresAt,
    userAgent: meta.userAgent?.slice(0, 500) ?? undefined,
    ipAddress: meta.ipAddress?.slice(0, 64) ?? undefined,
  });

  return { token, expiresAt, sessionId: session._id.toString() };
}

export interface SessionWithUser {
  session: SessionDoc;
  user: UserDoc;
}

export async function getSessionWithUser(token: string): Promise<SessionWithUser | null> {
  await getDb();
  const session = await Session.findOne({
    token,
    expiresAt: { $gt: new Date() },
  }).lean<SessionDoc>();
  if (!session) return null;

  const user = await User.findById(session.userId).lean<UserDoc>();
  if (!user) return null;
  if (!user.isActive) return null;

  return { session, user };
}

export async function deleteSession(token: string): Promise<void> {
  await getDb();
  await Session.deleteOne({ token });
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
  isActive: boolean;
}

function toSafeUser(user: UserDoc): SafeUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role as "super_admin" | "admin",
    isActive: user.isActive,
  };
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  const result = await getSessionWithUser(token);
  if (!result) return null;
  return toSafeUser(result.user);
}
