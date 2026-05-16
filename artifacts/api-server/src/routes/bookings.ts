import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import { adminAuthMiddleware, requireAuth } from "../lib/auth";
import { sendNewBookingEmail, sendBookingStatusEmail } from "../lib/email";
import QRCode from "qrcode";
import crypto from "crypto";

const router: IRouter = Router();

const ALL_SLOTS = [
  { time: "10:00", label: "10:00 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "12:00", label: "12:00 PM" },
  { time: "14:00", label: "2:00 PM" },
  { time: "15:00", label: "3:00 PM" },
  { time: "16:00", label: "4:00 PM" },
  { time: "17:00", label: "5:00 PM" },
  { time: "18:00", label: "6:00 PM" },
];

function serializeBooking(b: typeof bookingsTable.$inferSelect) {
  return {
    id: b.id,
    consultationId: b.consultationId,
    userId: b.userId ?? null,
    fullName: b.fullName,
    phone: b.phone,
    email: b.email,
    service: b.service,
    preferredDate: b.preferredDate,
    timeSlot: b.timeSlot,
    budgetRange: b.budgetRange,
    projectLocation: b.projectLocation,
    message: b.message ?? null,
    status: b.status,
    qrCode: b.qrCode ?? null,
    createdAt: b.createdAt.toISOString(),
  };
}

function generateConsultationId(): string {
  return "MH-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

const BASE_URL = (() => {
  const domain = process.env.REPLIT_DEV_DOMAIN ?? process.env.REPLIT_DOMAINS?.split(",")[0] ?? "localhost";
  return domain.startsWith("http") ? domain : `https://${domain}`;
})();

// GET /bookings/slots — public
router.get("/bookings/slots", async (req, res): Promise<void> => {
  const date = req.query.date as string;
  if (!date) { res.status(400).json({ error: "date is required" }); return; }
  const existing = await db.select({ timeSlot: bookingsTable.timeSlot }).from(bookingsTable)
    .where(and(eq(bookingsTable.preferredDate, date), eq(bookingsTable.status, "pending")));
  const bookedTimes = new Set(existing.map((b) => b.timeSlot));
  res.json(ALL_SLOTS.map((slot) => ({ ...slot, available: !bookedTimes.has(slot.time) })));
});

// GET /bookings/my — customer auth required
router.get("/bookings/my", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).user.id;
  const rows = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, userId)).orderBy(desc(bookingsTable.createdAt));
  res.json(rows.map(serializeBooking));
});

// GET /bookings/verify/:consultationId — public
router.get("/bookings/verify/:consultationId", async (req, res): Promise<void> => {
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.consultationId, req.params.consultationId));
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
  res.json({ booking: serializeBooking(booking), verified: true });
});

// GET /bookings — admin only
router.get("/bookings", adminAuthMiddleware, async (req, res): Promise<void> => {
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;
  let rows = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  if (status && status !== "all") rows = rows.filter((b) => b.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((b) => b.fullName.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.service.toLowerCase().includes(q));
  }
  res.json(rows.map(serializeBooking));
});

// POST /bookings — customer auth required
router.post("/bookings", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).user.id;
  const { fullName, phone, email, service, preferredDate, timeSlot, budgetRange, projectLocation, message } = req.body;
  if (!fullName || !phone || !email || !service || !preferredDate || !timeSlot || !budgetRange || !projectLocation) {
    res.status(400).json({ error: "All required fields must be provided" }); return;
  }
  const existing = await db.select().from(bookingsTable).where(and(eq(bookingsTable.preferredDate, preferredDate), eq(bookingsTable.timeSlot, timeSlot)));
  if (existing.length > 0) { res.status(409).json({ error: "This time slot is already booked. Please choose another." }); return; }

  const consultationId = generateConsultationId();
  let qrCode: string | null = null;
  try { qrCode = await QRCode.toDataURL(`${BASE_URL}/verify/${consultationId}`, { width: 256, margin: 2 }); } catch { /* non-critical */ }

  const [booking] = await db.insert(bookingsTable).values({
    consultationId, userId, fullName, phone, email, service, preferredDate, timeSlot, budgetRange, projectLocation, message: message ?? null, status: "pending", qrCode,
  }).returning();

  sendNewBookingEmail(booking).catch(() => {});
  req.log.info({ bookingId: booking.id, consultationId }, "New consultation booking");
  res.status(201).json(serializeBooking(booking));
});

// PATCH /bookings/:id/status — admin only
router.patch("/bookings/:id/status", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const { status } = req.body;
  if (!["pending", "confirmed", "completed", "rejected"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const [booking] = await db.update(bookingsTable).set({ status }).where(eq(bookingsTable.id, id)).returning();
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
  sendBookingStatusEmail(booking).catch(() => {});
  res.json(serializeBooking(booking));
});

export default router;
