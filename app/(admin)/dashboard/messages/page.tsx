"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, MailOpen, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/contact").then((r) => r.json()).then((d) => { setMessages(d.messages || []); setLoading(false); });
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/contact/${id}/read`, { method: "PATCH" });
    setMessages((ms) => ms.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const unread = messages.filter((m) => !m.read).length;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-[var(--green)]" /></div>;

  return (
    <div className="pt-14 md:pt-0">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-display text-3xl font-bold">Messages<span className="text-[var(--green)]">.</span></h1>
        {unread > 0 && (
          <span className="font-mono text-xs bg-[var(--green)] text-[var(--bg-primary)] px-2 py-1 rounded-sm">
            {unread} unread
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="card p-12 text-center">
          <Mail size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="font-mono text-sm text-[var(--text-muted)]">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              whileHover={{ x: 2 }}
              onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
              className={`card p-4 cursor-pointer transition-all ${!msg.read ? "border-[rgba(0,200,83,0.25)] bg-[var(--green-dim)]" : "hover:border-[var(--border-default)]"}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {msg.read
                    ? <MailOpen size={14} className="text-[var(--text-muted)]" />
                    : <Mail size={14} className="text-[var(--green)]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <p className="font-display font-semibold text-sm">{msg.name}</p>
                    <p className="font-mono text-xs text-[var(--text-muted)]">{msg.email}</p>
                    <p className="font-mono text-xs text-[var(--text-muted)] ml-auto">{formatDate(msg.createdAt)}</p>
                  </div>
                  <p className="font-body text-sm text-[var(--text-secondary)] font-medium">{msg.subject}</p>
                  <p className="font-body text-xs text-[var(--text-muted)] truncate">{msg.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-0 left-0 right-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl md:w-full z-50 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-t-sm md:rounded-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold">{selected.subject}</h2>
                <button onClick={() => setSelected(null)}><X size={16} className="text-[var(--text-muted)]" /></button>
              </div>
              <div className="space-y-3 mb-5">
                {[["From", selected.name], ["Email", selected.email], ["Date", formatDate(selected.createdAt)]].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)] w-12 shrink-0">{k}</span>
                    <span className="font-body text-sm text-[var(--text-secondary)]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm p-4">
                <p className="font-body text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="mt-4">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary text-sm w-full justify-center">
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
