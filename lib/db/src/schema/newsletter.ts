import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const newsletterTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type NewsletterSubscriber = typeof newsletterTable.$inferSelect;
