import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, contactsTable } from "@workspace/db";
import { adminAuthMiddleware } from "../lib/auth";
import { sendNewContactEmail } from "../lib/email";

const router: IRouter = Router();

function serializeContact(c: typeof contactsTable.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    service: c.service,
    message: c.message,
    isReplied: c.isReplied,
    createdAt: c.createdAt.toISOString(),
  };
}

// POST /contacts — public
router.post("/contacts", async (req, res): Promise<void> => {
  const { name, phone, email, service, message } = req.body;
  if (!name || !phone || !email || !service || !message) {
    res.status(400).json({ error: "All fields are required" }); return;
  }
  const [contact] = await db.insert(contactsTable).values({ name, phone, email, service, message, isReplied: false }).returning();
  sendNewContactEmail(contact).catch(() => {});
  res.status(201).json(serializeContact(contact));
});

// GET /contacts — admin only
router.get("/contacts", adminAuthMiddleware, async (req, res): Promise<void> => {
  const search = req.query.search as string | undefined;
  const replied = req.query.replied as string | undefined;

  let rows = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.service.toLowerCase().includes(q));
  }
  if (replied === "true") rows = rows.filter((c) => c.isReplied);
  if (replied === "false") rows = rows.filter((c) => !c.isReplied);
  res.json(rows.map(serializeContact));
});

// PATCH /contacts/:id/replied — admin
router.patch("/contacts/:id/replied", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [contact] = await db.update(contactsTable).set({ isReplied: true }).where(eq(contactsTable.id, id)).returning();
  if (!contact) { res.status(404).json({ error: "Contact not found" }); return; }
  res.json(serializeContact(contact));
});

// DELETE /contacts/:id — admin
router.delete("/contacts/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [deleted] = await db.delete(contactsTable).where(eq(contactsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Contact not found" }); return; }
  res.sendStatus(204);
});

export default router;
