"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ height: "var(--navbar-h)" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#080A08]/90 backdrop-blur-md border-b border-[rgba(0,200,83,0.1)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "bg-transparent"
        }`}
      >
        <div className="section-container h-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="Ransom" fill className="object-contain" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[var(--text-primary)] group-hover:text-[var(--green)] transition-colors duration-200">
              BRNK<span className="text-[var(--green)]">.</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-body font-medium transition-colors duration-200 rounded-sm ${
                    isActive ? "text-[var(--green)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[var(--green-dim)] border border-[var(--border-default)] rounded-sm"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Hire Me button */}
          <div className="hidden md:flex shrink-0">
            <Link href="/contact" className="btn-hire">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                Hire Me
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--green)] transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {menuOpen
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.div>
                : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0D110D] border-l border-[rgba(0,200,83,0.12)] z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[rgba(0,200,83,0.08)]">
                <span className="font-display font-bold text-base">Ransom<span className="text-[var(--green)]">.</span></span>
                <button onClick={() => setMenuOpen(false)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><X size={18} /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-sm font-body font-medium text-sm transition-all ${
                          isActive ? "text-[var(--green)] bg-[var(--green-dim)] border border-[var(--border-default)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="p-5 border-t border-[rgba(0,200,83,0.08)]">
                <Link href="/contact" className="btn-hire w-full justify-center" onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                    Hire Me
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
