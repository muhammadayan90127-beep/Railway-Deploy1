import { Router, type IRouter } from "express";

const router: IRouter = Router();

const RESPONSES: Record<string, string> = {
  service: "We offer Residential Interior Design, Commercial Interior Design, Modular Kitchen Design, False Ceiling Design, Wallpaper and Texture Design, Custom Furniture Design, Vastu-Based Layouts, 3D Visualization, and Smart Luxury Interiors.",
  price: "We offer affordable luxury solutions tailored to your specific budget. For accurate pricing, we recommend booking a free consultation so our experts can assess your project requirements.",
  book: "You can book a free consultation directly on our website by clicking 'Book Consultation' in the navigation bar. Our team will confirm your appointment and get back to you within 24 hours.",
  location: "Our studio is located in Amroha, Uttar Pradesh, India. We serve clients across multiple cities in Northern India.",
  contact: "You can reach us at +91 96902 88828 or email us at mhinteriordesign@gmail.com. Our working hours are Monday to Saturday, 10:00 AM to 7:00 PM. You can also WhatsApp us directly on +91 96902 88828.",
  timeline: "Project timelines vary based on scope. A standard room redesign typically takes 4-6 weeks, while full home interiors may take 3-6 months. We always adhere strictly to agreed timelines.",
  vastu: "Yes, we incorporate Vastu principles in our designs at no extra charge. Our experts ensure your space is both aesthetically stunning and harmoniously aligned with traditional Vastu guidelines.",
};

function getReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("service") || lower.includes("offer") || lower.includes("work")) return RESPONSES.service;
  if (lower.includes("price") || lower.includes("cost") || lower.includes("budget") || lower.includes("rate") || lower.includes("estimate")) return RESPONSES.price;
  if (lower.includes("book") || lower.includes("consultation") || lower.includes("appointment") || lower.includes("schedule")) return RESPONSES.book;
  if (lower.includes("location") || lower.includes("where") || lower.includes("address") || lower.includes("city")) return RESPONSES.location;
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("call") || lower.includes("reach")) return RESPONSES.contact;
  if (lower.includes("time") || lower.includes("duration") || lower.includes("long") || lower.includes("complete")) return RESPONSES.timeline;
  if (lower.includes("vastu") || lower.includes("vaastu")) return RESPONSES.vastu;
  return "Thank you for reaching out to MH Interior Design. Our team specializes in luxury interior design across Amroha and Northern India. For personalized guidance, I recommend booking a free consultation with our experts. You can also call or WhatsApp us at +91 96902 88828.";
}

router.post("/chat", async (req, res): Promise<void> => {
  const { message } = req.body;
  if (!message?.trim()) { res.status(400).json({ error: "message is required" }); return; }
  const reply = getReply(message);
  res.json({ reply });
});

export default router;
