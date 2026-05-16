import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPhone, FiMail, FiMapPin, FiGlobe, FiBriefcase } from "react-icons/fi";

const COMPANY = {
  name: "MH Interior Design",
  tagline: "Luxury Interior Design Consultations",
  phone: "+91 96902 88828",
  email: "mhinteriordesign@gmail.com",
  website: "www.mhinteriordesign.in",
  address: "Amroha, Uttar Pradesh, India",
  services: "Residential · Commercial · Modular Kitchen · 3D Visualization",
};

function useQRCode(text: string) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(text, { width: 200, margin: 1, color: { dark: "#c7a04e", light: "#0e1117" } }).then(setSrc);
    }).catch(() => {});
  }, [text]);
  return src;
}

interface VisitingCardModalProps { onClose: () => void; }

function VisitingCardModal({ onClose }: VisitingCardModalProps) {
  const vcardText = [
    "BEGIN:VCARD", "VERSION:3.0",
    `FN:${COMPANY.name}`,
    `ORG:${COMPANY.name}`,
    `TITLE:${COMPANY.tagline}`,
    `TEL:${COMPANY.phone}`,
    `EMAIL:${COMPANY.email}`,
    `URL:https://${COMPANY.website}`,
    `ADR:;;${COMPANY.address};;;;`,
    "END:VCARD",
  ].join("\n");
  const qrSrc = useQRCode(vcardText);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, hsl(220,14%,10%), hsl(220,14%,8%))",
          border: "1px solid hsl(43,65%,30%)",
          boxShadow: "0 0 60px rgba(199,160,78,0.15), 0 25px 50px rgba(0,0,0,0.8)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-[hsl(220,12%,16%)] text-[hsl(45,10%,55%)] hover:text-[hsl(43,65%,62%)] transition-colors"
        >
          <FiX size={16} />
        </button>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  <span className="text-[hsl(220,15%,6%)] font-bold text-sm">MH</span>
                </div>
                <h2 className="font-serif text-2xl font-bold gold-gradient-text">{COMPANY.name}</h2>
              </div>
              <p className="text-xs text-[hsl(45,10%,55%)] tracking-widest uppercase">{COMPANY.tagline}</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {[
                { icon: FiPhone, label: COMPANY.phone, href: `tel:${COMPANY.phone}` },
                { icon: FiMail, label: COMPANY.email, href: `mailto:${COMPANY.email}` },
                { icon: FiGlobe, label: COMPANY.website, href: `https://${COMPANY.website}` },
                { icon: FiMapPin, label: COMPANY.address },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[hsl(43,65%,62%)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-[hsl(43,65%,62%)]" />
                  </div>
                  {href ? (
                    <a href={href} className="text-sm text-[hsl(45,15%,75%)] hover:text-[hsl(43,65%,62%)] transition-colors break-all leading-snug">{label}</a>
                  ) : (
                    <span className="text-sm text-[hsl(45,15%,75%)] leading-snug">{label}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-[hsl(220,14%,13%)] flex items-center justify-center border border-[hsl(43,65%,25%)]">
                {qrSrc ? (
                  <img src={qrSrc} alt="QR Code" className="w-full h-full" />
                ) : (
                  <div className="w-full h-full animate-pulse bg-[hsl(220,12%,18%)]" />
                )}
              </div>
              <p className="text-xs text-[hsl(45,10%,45%)] text-center">Scan to save contact</p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[hsl(220,12%,18%)]">
            <div className="flex items-center gap-2">
              <FiBriefcase size={12} className="text-[hsl(43,65%,62%)]" />
              <p className="text-xs text-[hsl(45,10%,50%)]">{COMPANY.services}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 gold-gradient opacity-40" />
      </motion.div>
    </motion.div>
  );
}

export default function VisitingCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>{open && <VisitingCardModal onClose={() => setOpen(false)} />}</AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        title="MH Interior Design Business Card"
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center border-2 border-[hsl(43,65%,50%)]"
        style={{ background: "linear-gradient(135deg, hsl(220,14%,10%), hsl(220,14%,8%))" }}
      >
        <span className="font-serif font-bold text-sm gold-gradient-text">MH</span>
      </motion.button>
    </>
  );
}
