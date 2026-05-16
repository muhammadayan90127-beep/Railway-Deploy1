import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { signToken, requireAuth } from "../lib/auth";
import { sendNewUserEmail } from "../lib/email";

const router: IRouter = Router();

function serializeUser(u: typeof usersTable.$inferSelect) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone ?? null, role: u.role, isLocked: u.isLocked, createdAt: u.createdAt.toISOString() };
}

// POST /auth/register
router.post("/auth/register", async (req, res): Promise<void> => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) { res.status(400).json({ error: "name, email, and password are required" }); return; }
  if (password.length < 6) { res.status(400).json({ error: "Password must be at least 6 characters" }); return; }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (existing) { res.status(400).json({ error: "An account with this email already exists" }); return; }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable).values({
    name, email: email.toLowerCase(), passwordHash, phone: phone ?? null, role: "customer", isLocked: false,
  }).returning();

  sendNewUserEmail(user).catch(() => {});
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({ user: serializeUser(user), token });
});

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: "email and password are required" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user) { res.status(401).json({ error: "Invalid email or password" }); return; }
  if (user.isLocked) { res.status(403).json({ error: "Your account has been locked. Please contact support." }); return; }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) { res.status(401).json({ error: "Invalid email or password" }); return; }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ user: serializeUser(user), token });
});

// POST /auth/logout
router.post("/auth/logout", (_req, res): void => {
  res.json({ message: "Logged out successfully" });
});

// GET /auth/me
router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).user.id;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  if (user.isLocked) { res.status(403).json({ error: "Account locked" }); return; }
  res.json(serializeUser(user));
});

// POST /auth/change-password
router.post("/auth/change-password", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).user.id;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { res.status(400).json({ error: "currentPassword and newPassword are required" }); return; }
  if (newPassword.length < 6) { res.status(400).json({ error: "New password must be at least 6 characters" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) { res.status(400).json({ error: "Current password is incorrect" }); return; }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, userId));
  res.json({ message: "Password changed successfully" });
});

// PATCH /auth/profile
router.patch("/auth/profile", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).user.id;
  const { name, phone, email } = req.body;
  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (email) {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (existing && existing.id !== userId) { res.status(400).json({ error: "Email already in use" }); return; }
    updates.email = email.toLowerCase();
  }

  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, userId)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(serializeUser(user));
});

export default router;
