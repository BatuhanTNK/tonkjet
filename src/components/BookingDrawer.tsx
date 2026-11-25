"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, X, Check } from "lucide-react";

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDrawer({ isOpen, onClose }: BookingDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !acceptedPrivacy) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setDestination("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:p-6 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Book a Flight with TonkJet"
        >
          {/* Dimmed Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-[#050505]/70 backdrop-blur-md"
          />

          {/* Bottom-Docked Floating White Drawer (Jesko Jets Signature Style) */}
          <motion.div
            initial={{ y: "110%", opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "110%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[1200px]"
          >
            {/* Floating Centered Circular Close Button above Drawer Top Edge */}
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close booking drawer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF8ED] text-[#141010] shadow-xl border border-[#141010]/10 transition-transform duration-300 hover:scale-105 hover:rotate-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Surface */}
            <div className="rounded-3xl bg-[#FFF8ED] text-[#141010] shadow-[0_32px_90px_rgba(0,0,0,0.45)] overflow-hidden border border-[#141010]/10">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#141010]/12">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#312726]/55">
                      TONKJET FLIGHT DESK · 24/7 DISPATCH
                    </span>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl font-medium tracking-[-0.02em]">
                      Contact &amp; Charter Request
                    </h3>
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#312726]/55">
                    RESPONSE UNDER 15 MIN
                  </span>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141010] text-[#FFF8ED]">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-xl font-medium text-[#141010]">
                          Flight Request Received, {name}
                        </h4>
                        <p className="mt-1 text-sm text-[#312726]/75 max-w-lg">
                          Your dedicated TonkJet aviation advisor has logged your
                          itinerary{destination ? ` toward ${destination}` : ""} and
                          will reach out to <span className="font-medium text-[#141010]">{email}</span> shortly.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="rounded-full bg-[#141010] px-6 py-3 text-xs font-mono tracking-[0.2em] uppercase text-[#FFF8ED] hover:bg-[#312726] transition-colors"
                    >
                      Return to TonkJet
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="pt-6">
                    {/* 4 Horizontal Hairline-Separated Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#141010]/12 border border-[#141010]/12 rounded-2xl bg-white/60">
                      <label className="flex flex-col px-5 py-4 focus-within:bg-white transition-colors rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                        <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[#312726]/55">
                          NAME *
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="mt-1.5 bg-transparent text-sm font-medium text-[#141010] placeholder:text-[#312726]/35 focus:outline-none"
                        />
                      </label>

                      <label className="flex flex-col px-5 py-4 focus-within:bg-white transition-colors">
                        <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[#312726]/55">
                          EMAIL *
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="mt-1.5 bg-transparent text-sm font-medium text-[#141010] placeholder:text-[#312726]/35 focus:outline-none"
                        />
                      </label>

                      <label className="flex flex-col px-5 py-4 focus-within:bg-white transition-colors">
                        <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[#312726]/55">
                          PHONE
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+90 / +971 ..."
                          className="mt-1.5 bg-transparent text-sm font-medium text-[#141010] placeholder:text-[#312726]/35 focus:outline-none"
                        />
                      </label>

                      <label className="flex flex-col px-5 py-4 focus-within:bg-white transition-colors rounded-b-2xl sm:rounded-r-2xl sm:rounded-bl-none">
                        <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[#312726]/55">
                          ARRIVING / ROUTE
                        </span>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g. Istanbul → Geneva"
                          className="mt-1.5 bg-transparent text-sm font-medium text-[#141010] placeholder:text-[#312726]/35 focus:outline-none"
                        />
                      </label>
                    </div>

                    {/* Footer Controls: Privacy Checkbox + Circular Airplane Submit */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setAcceptedPrivacy((v) => !v)}
                        className="flex items-center gap-3 text-left text-xs text-[#312726]/75 hover:text-[#141010] transition-colors"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            acceptedPrivacy
                              ? "border-[#141010] bg-[#141010] text-[#FFF8ED]"
                              : "border-[#141010]/35 bg-transparent"
                          }`}
                        >
                          {acceptedPrivacy && <Check className="h-3 w-3" />}
                        </span>
                        <span>
                          I agree to the{" "}
                          <span className="underline underline-offset-4">
                            Privacy Policy
                          </span>{" "}
                          and discreet charter communication.
                        </span>
                      </button>

                      <button
                        type="submit"
                        disabled={!acceptedPrivacy}
                        className="group flex items-center justify-center gap-3 rounded-full bg-[#141010] py-2 pl-6 pr-2 text-xs font-mono tracking-[0.2em] uppercase text-[#FFF8ED] transition-all duration-300 hover:bg-[#312726] disabled:opacity-40"
                      >
                        <span>Send Charter Request</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8ED] text-[#141010] overflow-hidden relative">
                          <Plane className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                          <Plane
                            aria-hidden="true"
                            className="h-4 w-4 -rotate-45 absolute -translate-x-5 translate-y-5 transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
                          />
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
