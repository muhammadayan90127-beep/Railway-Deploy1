import { motion } from "framer-motion";
import { Link } from "wouter";
import { FiArrowRight } from "react-icons/fi";

const SERVICES = [
  { icon: "🏠", title: "Residential Interior Design", desc: "Transform your living spaces into luxurious sanctuaries. From living rooms to bedrooms, we craft interiors that reflect your personality and lifestyle.", features: ["Complete Space Planning", "Custom Furniture Design", "Lighting Design", "Material & Finish Selection"] },
  { icon: "🏢", title: "Commercial Interior Design", desc: "Elevate your business environment with sophisticated designs. Our commercial interiors boost productivity, impress clients, and reflect your brand identity.", features: ["Office Design", "Retail Spaces", "Restaurant & Hospitality", "Corporate Branding Integration"] },
  { icon: "🍳", title: "Modular Kitchen Design", desc: "Modern, functional kitchens that combine style with efficiency. Premium materials, smart storage solutions, and ergonomic layouts.", features: ["Custom Cabinets", "Premium Countertops", "Smart Storage Solutions", "Appliance Integration"] },
  { icon: "✨", title: "False Ceiling Design", desc: "Stunning ceiling designs that add drama, depth, and personality to any space. From minimalist to ornate, we create ceilings that impress.", features: ["Gypsum Board Ceilings", "POP Designs", "LED Integration", "Acoustic Solutions"] },
  { icon: "🎨", title: "3D Visualization", desc: "See your dream space before the first nail is driven. Photorealistic 3D renders help you visualize and refine your design with confidence.", features: ["Photorealistic Renders", "360° Walkthroughs", "Material Visualization", "Multiple Design Options"] },
  { icon: "🧭", title: "Vastu-Based Layouts", desc: "Harmonious spaces aligned with Vastu Shastra principles. Our Vastu-compliant designs promote positive energy, health, and prosperity.", features: ["Vastu Site Analysis", "Room Direction Planning", "Color Consultation", "Energy Optimization"] },
  { icon: "🪑", title: "Custom Furniture Design", desc: "One-of-a-kind furniture pieces crafted to perfectly suit your space and taste. From concept to creation, every piece tells your story.", features: ["Bespoke Designs", "Premium Wood & Materials", "Space-Optimized Pieces", "Upholstery Selection"] },
  { icon: "🖼️", title: "Wallpaper & Texture Design", desc: "Transform plain walls into artistic statements. Our wallpaper and texture designs add character, warmth, and sophistication.", features: ["Premium Wallpapers", "Textured Finishes", "Decorative Panels", "Accent Wall Design"] },
];

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] text-[hsl(43,65%,62%)] uppercase mb-3">What We Do</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Our <span className="gold-gradient-text">Services</span></h1>
          <p className="text-[hsl(45,10%,55%)] max-w-xl mx-auto">Comprehensive interior design solutions crafted with passion, precision, and artistry.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="p-8 rounded-2xl border border-[hsl(220,12%,16%)] bg-[hsl(220,14%,9%)] hover:border-[hsl(43,65%,40%)] transition-colors"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h2 className="font-serif text-xl font-semibold text-[hsl(45,15%,88%)] mb-3">{s.title}</h2>
              <p className="text-sm text-[hsl(45,10%,55%)] leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[hsl(45,10%,65%)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(43,65%,62%)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/book">
            <span className="gold-gradient text-[hsl(220,15%,6%)] px-10 py-4 rounded-full font-semibold cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              Book Free Consultation <FiArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
