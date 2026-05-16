import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterTable } from "@workspace/db";
import { sendNewsletterConfirmationEmail } from "../lib/email";

const router: IRouter = Router();

// POST /newsletter/subscribe
router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  const [existing] = await db.select().from(newsletterTable).where(eq(newsletterTable.email, email.toLowerCase()));
  if (existing) {
    res.json({ message: "You are already subscribed!" });
    return;
  }

  await db.insert(newsletterTable).values({ email: email.toLowerCase() });
  sendNewsletterConfirmationEmail(email).catch(() => {});
  res.json({ message: "Thank you for subscribing!" });
});

export default router;
