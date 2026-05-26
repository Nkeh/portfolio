"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, User, FileText, FolderOpen, BookOpen, Star, MessageSquare, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/about", label: "About", icon: User },
  { href: "/admin/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/admin/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/dashboard/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/admin/dashboard/messages", label: "Messages", icon: MessageSquare },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7"><Image src="/logo.png" alt="Ransom" fill className="object-contain"  /></div>
          <div>
            <span className="font-display font-bold text-sm">BRNK<span className="text-[var(--green)]">.</span></span>
            <p className="font-mono text-[10px] text-[var(--text-muted)]">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/admin/dashboard";
          const isExactDash = href === "/admin/dashboard" && pathname === "/admin/dashboard";
          const isActive = isExactDash || (!exact && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body font-medium transition-all duration-200 ${
                isActive ? "bg-[var(--green-dim)] text-[var(--green)] border border-[var(--border-default)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              }`}>
              <Icon size={14} />{label}
              {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-[var(--green)]" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border-subtle)] space-y-1">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-sm hover:bg-[var(--bg-elevated)]">
          <ExternalLink size={13} />View Site
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all rounded-sm">
          <LogOut size={13} />Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col admin-sidebar z-40">
        <NavContent />
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] z-50 flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="font-display font-bold text-sm">Admin<span className="text-[var(--green)]">.</span></Link>
        <button onClick={() => setOpen(!open)} className="p-2 text-[var(--text-secondary)]">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="md:hidden fixed inset-0 bg-black/60 z-40" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="md:hidden fixed left-0 top-0 h-full w-64 admin-sidebar z-50 flex flex-col">
              <NavContent onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
