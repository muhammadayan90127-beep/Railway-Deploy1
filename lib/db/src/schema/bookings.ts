import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  consultationId: text("consultation_id").notNull().unique(),
  userId: integer("user_id").references(() => usersTable.id),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  preferredDate: text("preferred_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  budgetRange: text("budget_range").notNull(),
  projectLocation: text("project_location").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Booking = typeof bookingsTable.$inferSelect;
export type InsertBooking = typeof bookingsTable.$inferInsert;
