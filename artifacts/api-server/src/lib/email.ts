import { Resend } from "resend";
import { logger } from "./logger";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}
const ADMIN_EMAIL = "mayan7296@gmail.com";
const FROM_EMAIL = "MH Interior Design <onboarding@resend.dev>";

function luxuryTemplate(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${title}</title></head><body style="margin:0;padding:0;background:#0d0f12;font-family:'Georgia',serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f12;padding:40px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#12151a;border-radius:16px;border:1px solid #2a2d35;overflow:hidden;"><tr><td style="background:linear-gradient(135deg,#1a1c22 0%,#12151a 100%);padding:40px 48px;border-bottom:1px solid #2a2d35;text-align:center;"><span style="font-size:32px;font-weight:700;color:#c9a96e;letter-spacing:4px;font-family:'Georgia',serif;">MH</span><span style="display:block;font-size:10px;color:#9a8a6a;letter-spacing:6px;margin-top:4px;font-family:'Arial',sans-serif;">INTERIOR DESIGN</span><div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);margin:20px auto 0;"></div><h1 style="color:#e8dcc8;font-size:22px;margin:20px 0 0;font-weight:400;letter-spacing:1px;">${title}</h1></td></tr><tr><td style="padding:40px 48px;">${body}</td></tr><tr><td style="background:#0d0f12;padding:24px 48px;border-top:1px solid #2a2d35;text-align:center;"><p style="color:#4a4a5a;font-size:12px;margin:0;font-family:'Arial',sans-serif;letter-spacing:1px;">MH INTERIOR DESIGN · AMROHA, UTTAR PRADESH, INDIA</p><p style="color:#4a4a5a;font-size:11px;margin:8px 0 0;font-family:'Arial',sans-serif;">Transforming Spaces, Inspiring Lives</p></td></tr></table></td></tr></table></body></html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #1e2128;"><span style="color:#7a7a8a;font-size:12px;letter-spacing:1px;font-family:'Arial',sans-serif;text-transform:uppercase;">${label}</span><div style="color:#e8dcc8;font-size:15px;margin-top:4px;font-family:'Georgia',serif;">${value}</div></td></tr>`;
}

const BASE_URL = (() => {
  const domain = process.env.REPLIT_DEV_DOMAIN ?? process.env.REPLIT_DOMAINS?.split(",")[0] ?? "localhost";
  return domain.startsWith("http") ? domain : `https://${domain}`;
})();

function adminPanelButton(): string {
  return `<div style="margin-top:32px;text-align:center;"><a href="${BASE_URL}/admin" style="display:inline-block;background:#c9a96e;color:#0d0f12;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:1px;font-family:'Arial',sans-serif;">OPEN ADMIN PANEL</a></div>`;
}

export async function sendNewBookingEmail(booking: {
  id: number; consultationId: string; fullName: string; phone: string; email: string;
  service: string; preferredDate: string; timeSlot: string; budgetRange: string;
  projectLocation: string; message?: string | null;
}) {
  const body = `<p style="color:#9a8a6a;font-size:14px;margin:0 0 24px;font-family:'Arial',sans-serif;">A new consultation has been requested. Manage it from the Admin Panel.</p><table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1e2128;">${infoRow("Consultation ID", booking.consultationId)}${infoRow("Client Name", booking.fullName)}${infoRow("Phone", booking.phone)}${infoRow("Email", booking.email)}${infoRow("Service", booking.service)}${infoRow("Date", booking.preferredDate)}${infoRow("Time", booking.timeSlot)}${infoRow("Budget", booking.budgetRange)}${infoRow("Location", booking.projectLocation)}${booking.message ? infoRow("Message", booking.message) : ""}</table>${adminPanelButton()}`;
  try {
    const _r = getResend(); if (_r) await _r.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: `New Booking — ${booking.fullName} | ${booking.service}`, html: luxuryTemplate("New Consultation Booking", body) });
  } catch (err) { logger.error({ err }, "Failed to send new booking email"); }
}

export async function sendBookingStatusEmail(booking: {
  id: number; fullName: string; email: string; service: string; preferredDate: string; timeSlot: string; status: string;
}) {
  const colors: Record<string, string> = { confirmed: "#4caf7d", completed: "#c9a96e", rejected: "#c0392b", pending: "#7a7a8a" };
  const color = colors[booking.status] ?? "#c9a96e";
  const body = `<p style="color:#9a8a6a;font-size:14px;margin:0 0 24px;font-family:'Arial',sans-serif;">A booking status has been updated.</p><table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1e2128;">${infoRow("Client", booking.fullName)}${infoRow("Service", booking.service)}${infoRow("Date & Time", `${booking.preferredDate} at ${booking.timeSlot}`)}${infoRow("New Status", `<span style="color:${color};font-weight:600;text-transform:uppercase;">${booking.status}</span>`)}</table>${adminPanelButton()}`;
  try {
    const _r = getResend(); if (_r) await _r.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: `Booking Status — ${booking.fullName} → ${booking.status}`, html: luxuryTemplate("Booking Status Updated", body) });
  } catch (err) { logger.error({ err }, "Failed to send booking status email"); }
}

export async function sendNewReviewEmail(review: { id: number; name: string; rating: number; message: string; city?: string | null }) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const body = `<p style="color:#9a8a6a;font-size:14px;margin:0 0 24px;font-family:'Arial',sans-serif;">A new review is awaiting approval.</p><table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1e2128;">${infoRow("Reviewer", review.name)}${infoRow("City", review.city ?? "—")}${infoRow("Rating", `<span style="color:#c9a96e;">${stars}</span> (${review.rating}/5)`)}${infoRow("Review", review.message)}</table>${adminPanelButton()}`;
  try {
    const _r = getResend(); if (_r) await _r.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: `New Review — ${review.name} | ${stars}`, html: luxuryTemplate("New Review Submitted", body) });
  } catch (err) { logger.error({ err }, "Failed to send new review email"); }
}

export async function sendNewContactEmail(contact: { id: number; name: string; phone: string; email: string; service: string; message: string }) {
  const body = `<p style="color:#9a8a6a;font-size:14px;margin:0 0 24px;font-family:'Arial',sans-serif;">A new contact form submission has been received.</p><table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1e2128;">${infoRow("Name", contact.name)}${infoRow("Phone", contact.phone)}${infoRow("Email", contact.email)}${infoRow("Service", contact.service)}${infoRow("Message", contact.message)}</table>${adminPanelButton()}`;
  try {
    const _r = getResend(); if (_r) await _r.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: `New Contact — ${contact.name} | ${contact.service}`, html: luxuryTemplate("New Contact Submission", body) });
  } catch (err) { logger.error({ err }, "Failed to send new contact email"); }
}

export async function sendNewUserEmail(user: { name: string; email: string }) {
  const body = `<p style="color:#9a8a6a;font-size:14px;margin:0 0 24px;font-family:'Arial',sans-serif;">A new customer has registered.</p><table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1e2128;">${infoRow("Name", user.name)}${infoRow("Email", user.email)}</table>${adminPanelButton()}`;
  try {
    const _r = getResend(); if (_r) await _r.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: `New Customer — ${user.name}`, html: luxuryTemplate("New Customer Registered", body) });
  } catch (err) { logger.error({ err }, "Failed to send new user email"); }
}
