import { Router, type IRouter } from "express";
import { db, bookingsTable, usersTable, reviewsTable, contactsTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";
import { checkAdminPassword, generateAdminToken, verifyAdminToken, adminAuthMiddleware } from "../lib/auth";

const router: IRouter = Router();

// POST /admin/login
router.post("/admin/login", async (req, res): Promise<void> => {
  const { password } = req.body;
  if (!password) { res.status(400).json({ error: "Password required" }); return; }
  if (!checkAdminPassword(password)) { res.status(401).json({ error: "Invalid password" }); return; }
  const token = generateAdminToken();
  res.json({ token });
});

// GET /admin/verify
router.get("/admin/verify", (req, res): void => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!verifyAdminToken(auth.slice(7))) { res.status(401).json({ error: "Invalid or expired token" }); return; }
  res.json({ ok: true });
});

// GET /admin/dashboard — admin only
router.get("/admin/dashboard", adminAuthMiddleware, async (_req, res): Promise<void> => {
  const [allBookings, allReviews, allContacts, allUsers] = await Promise.all([
    db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)),
    db.select().from(reviewsTable),
    db.select().from(contactsTable),
    db.select().from(usersTable),
  ]);

  const serializeBooking = (b: typeof bookingsTable.$inferSelect) => ({
    id: b.id, consultationId: b.consultationId, userId: b.userId ?? null,
    fullName: b.fullName, phone: b.phone, email: b.email, service: b.service,
    preferredDate: b.preferredDate, timeSlot: b.timeSlot, budgetRange: b.budgetRange,
    projectLocation: b.projectLocation, message: b.message ?? null, status: b.status,
    qrCode: b.qrCode ?? null, createdAt: b.createdAt.toISOString(),
  });

  res.json({
    totalBookings: allBookings.length,
    pendingBookings: allBookings.filter((b) => b.status === "pending").length,
    confirmedBookings: allBookings.filter((b) => b.status === "confirmed").length,
    completedBookings: allBookings.filter((b) => b.status === "completed").length,
    rejectedBookings: allBookings.filter((b) => b.status === "rejected").length,
    totalUsers: allUsers.length,
    totalReviews: allReviews.length,
    pendingReviews: allReviews.filter((r) => r.status === "pending").length,
    unreadMessages: allContacts.filter((c) => !c.isReplied).length,
    recentBookings: allBookings.slice(0, 5).map(serializeBooking),
  });
});

// GET /admin/users — admin only
router.get("/admin/users", adminAuthMiddleware, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(users.map((u) => ({
    id: u.id, name: u.name, email: u.email, phone: u.phone ?? null,
    role: u.role, isLocked: u.isLocked, createdAt: u.createdAt.toISOString(),
  })));
});

// PATCH /admin/users/:id/lock — admin only
router.patch("/admin/users/:id/lock", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const { isLocked } = req.body;
  const [user] = await db.update(usersTable).set({ isLocked: Boolean(isLocked) }).where(eq(usersTable.id, id)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone ?? null, role: user.role, isLocked: user.isLocked, createdAt: user.createdAt.toISOString() });
});

export default router;
