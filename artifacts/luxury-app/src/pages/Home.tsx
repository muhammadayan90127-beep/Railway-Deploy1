import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListApprovedReviews } from "@workspace/api-client-react";
import { FiStar, FiArrowRight, FiCheck } from "react-icons/fi";

const SERVICES = [
  { title: "Residential Interior", icon: "🏠", desc: "Transform your home into a luxury sanctuary with bespoke design solutions." },
  { title: "Commercial Interior", icon: "🏢", desc: "Elevate your workspace with sophisticated designs that inspire productivity." },
  { title: "Modular Kitchen", icon: "🍳", desc: "Modern, functional kitchens crafted with premium materials and smart storage." },
  { title: "False Ceiling Design", icon: "✨", desc: "Stunning ceiling designs that add drama, depth, and elegance to any space." },
  { title: "3D Visualization", icon: "🎨", desc: "See your dream space before construction with photorealistic 3D renders." },
  { title: "Vastu-Based Layouts", icon: "🧭", desc: "Harmonious spaces designed with Vastu principles for positive energy." },
];

const STATS = [
  { value: "500+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "50+", label: "Design Awards" },
];

export default function Home() {
  const { data: reviews } = useListApprovedReviews();
  const topReviews = reviews?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,15%,4%)] via-[hsl(220,15%,6%)] to-[hsl(220,14%,9%)]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, hsl(43,65%,62%) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(43,55%,40%) 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs tracking-[0.4em] text-[hsl(43,65%,62%)] uppercase mb-4 font-medium">Luxury Interior Design</p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Crafting{" "}
            <span className="gold-gradient-text">Timeless</span>
            <br />Spaces
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg text-[hsl(45,10%,60%)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Award-winning interior designers transforming houses into homes and offices into inspiring workspaces across Northern India.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap gap-4 justify-center">
            <Link href="/book">
              <span className="gold-gradient text-[hsl(220,15%,6%)] px-8 py-3.5 rounded-full font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                Book Free Consultation <FiArrowRight />
              </span>
            </Link>
            <Link href="/portfolio">
              <span className="border border-[hsl(43,65%,40%)] text-[hsl(43,65%,62%)] px-8 py-3.5 rounded-full font-semibold text-sm cursor-pointer hover:bg-[hsl(43,65%,62%)]/10 transition-colors">
                View Portfolio
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-[hsl(220,12%,14%)]" style={{ background: "hsl(220,14%,8%)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-serif text-4xl font-bold gold-gradient-text mb-1">{s.value}</p>
                <p className="text-xs text-[hsl(45,10%,55%)] uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] text-[hsl(43,65%,62%)] uppercase mb-3">What We Offer</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our <span className="gold-gradient-text">Services</span></h2>
            <p className="text-[hsl(45,10%,55%)] max-w-xl mx-auto">Comprehensive interior design solutions tailored to your vision and lifestyle.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-[hsl(220,12%,16%)] bg-[hsl(220,14%,9%)] hover:border-[hsl(43,65%,40%)] transition-colors group"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-[hsl(45,15%,88%)] mb-2 group-hover:text-[hsl(43,65%,62%)] transition-colors">{s.title}</h3>
                <p className="text-sm text-[hsl(45,10%,55%)] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services">
              <span className="border border-[hsl(43,65%,40%)] text-[hsl(43,65%,62%)] px-8 py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-[hsl(43,65%,62%)]/10 transition-colors inline-flex items-center gap-2">
                View All Services <FiArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {topReviews.length > 0 && (
        <section className="py-24 px-4" style={{ background: "hsl(220,14%,8%)" }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <p className="text-xs tracking-[0.4em] text-[hsl(43,65%,62%)] uppercase mb-3">Testimonials</p>
              <h2 className="font-serif text-4xl font-bold">Client <span className="gold-gradient-text">Reviews</span></h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {topReviews.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-[hsl(220,12%,16%)] bg-[hsl(220,14%,10%)]"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <FiStar key={j} size={14} className={j < r.rating ? "text-[hsl(43,65%,62%)] fill-current" : "text-[hsl(220,12%,25%)]"} />
                    ))}
                  </div>
                  <p className="text-sm text-[hsl(45,10%,65%)] italic leading-relaxed mb-4">"{r.message}"</p>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(45,15%,88%)]">{r.name}</p>
                    {r.city && <p className="text-xs text-[hsl(45,10%,50%)]">{r.city}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/reviews">
                <span className="border border-[hsl(43,65%,40%)] text-[hsl(43,65%,62%)] px-8 py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-[hsl(43,65%,62%)]/10 transition-colors inline-flex items-center gap-2">
                  See All Reviews <FiArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.4em] text-[hsl(43,65%,62%)] uppercase mb-4">Get Started</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Ready to Transform <span className="gold-gradient-text">Your Space?</span></h2>
            <p className="text-[hsl(45,10%,55%)] mb-4 text-sm">Book a free consultation and let our expert designers create your dream interior.</p>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
              {["Free initial consultation", "Expert design team", "Premium materials", "On-time delivery"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[hsl(45,10%,65%)]">
                  <FiCheck className="text-[hsl(43,65%,62%)]" size={14} /> {f}
                </li>
              ))}
            </ul>
            <Link href="/book">
              <span className="gold-gradient text-[hsl(220,15%,6%)] px-10 py-4 rounded-full font-semibold cursor-pointer hover:opacity-90 transition-opacity inline-block">
                Book Your Free Consultation
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
