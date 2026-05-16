import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import { adminAuthMiddleware } from "../lib/auth";
import { sendNewReviewEmail } from "../lib/email";

const router: IRouter = Router();

function serializeReview(r: typeof reviewsTable.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    rating: r.rating,
    message: r.message,
    photoUrl: r.photoUrl ?? null,
    city: r.city ?? null,
    status: r.status,
    isPinned: r.isPinned,
    createdAt: r.createdAt.toISOString(),
  };
}

// GET /reviews/approved — public
router.get("/reviews/approved", async (_req, res): Promise<void> => {
  const reviews = await db.select().from(reviewsTable)
    .where(eq(reviewsTable.status, "approved"))
    .orderBy(reviewsTable.isPinned, desc(reviewsTable.createdAt));
  res.json(reviews.map(serializeReview));
});

// GET /reviews — admin only
router.get("/reviews", adminAuthMiddleware, async (req, res): Promise<void> => {
  const status = req.query.status as string | undefined;
  let rows = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  if (status && status !== "all") rows = rows.filter((r) => r.status === status);
  res.json(rows.map(serializeReview));
});

// POST /reviews — public
router.post("/reviews", async (req, res): Promise<void> => {
  const { name, rating, message, photoUrl, city } = req.body;
  if (!name || !rating || !message) { res.status(400).json({ error: "name, rating, and message are required" }); return; }
  const [review] = await db.insert(reviewsTable).values({
    name, rating: Number(rating), message, photoUrl: photoUrl ?? null, city: city ?? null, status: "pending", isPinned: false,
  }).returning();
  sendNewReviewEmail(review).catch(() => {});
  res.status(201).json(serializeReview(review));
});

// PATCH /reviews/:id/status — admin
router.patch("/reviews/:id/status", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const [review] = await db.update(reviewsTable).set({ status }).where(eq(reviewsTable.id, id)).returning();
  if (!review) { res.status(404).json({ error: "Review not found" }); return; }
  res.json(serializeReview(review));
});

// PATCH /reviews/:id/pin — admin
router.patch("/reviews/:id/pin", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const { isPinned } = req.body;
  const [review] = await db.update(reviewsTable).set({ isPinned: Boolean(isPinned) }).where(eq(reviewsTable.id, id)).returning();
  if (!review) { res.status(404).json({ error: "Review not found" }); return; }
  res.json(serializeReview(review));
});

// DELETE /reviews/:id — admin
router.delete("/reviews/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [deleted] = await db.delete(reviewsTable).where(eq(reviewsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Review not found" }); return; }
  res.sendStatus(204);
});

export default router;
