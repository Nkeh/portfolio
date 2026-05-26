"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Save, Loader2, Star } from "lucide-react";

interface Review {
  id: string; reviewerName: string; reviewerRole: string; organization: string;
  content: string; rating?: number | null; image?: string; date: string; featured: boolean; order: number;
}
const BLANK: Partial<Review> = {
  reviewerName: "", reviewerRole: "", organization: "", content: "",
  rating: 5, image: "", date: new Date().toISOString().split("T")[0], featured: false, order: 0,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Review>>({ ...BLANK });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/reviews").then((r) => r.json()).then((d) => { setReviews(d); setLoading(false); });
  }, []);

  const openNew = () => { setEditing({ ...BLANK }); setEditId(null); setModal(true); };
  const openEdit = (r: Review) => { setEditing({ ...r, date: r.date?.split("T")[0] }); setEditId(r.id); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId ? { ...editing, id: editId } : editing;
      const res = await fetch("/api/reviews", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      if (editId) setReviews((rs) => rs.map((r) => r.id === editId ? updated : r));
      else setReviews((rs) => [updated, ...rs]);
      setModal(false);
      toast.success(editId ? "Review updated!" : "Review created!");
    } catch { toast.error("Failed to save."); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch("/api/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setReviews((rs) => rs.filter((r) => r.id !== id));
    toast.success("Review deleted.");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-[var(--green)]" /></div>;

  return (
    <div className="pt-14 md:pt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Reviews<span className="text-[var(--green)]">.</span></h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={14} /> Add Review</button>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="card p-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-display font-semibold text-sm">{r.reviewerName}</p>
                {r.featured && <span className="tag text-[10px] py-0">Featured</span>}
                {r.rating && <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={10} className="text-[var(--green)] fill-[var(--green)]" />)}</div>}
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)]">{r.reviewerRole} · {r.organization}</p>
              <p className="font-body text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">{r.content}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(r)} className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><Edit2 size={13} /></button>
              <button onClick={() => remove(r.id)} className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-4 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:inset-auto z-50 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-sm overflow-y-auto max-h-[90vh]">
              <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] px-5 py-4 flex items-center justify-between">
                <h2 className="font-display font-bold text-sm">{editId ? "Edit" : "Add"} Review</h2>
                <button onClick={() => setModal(false)}><X size={16} className="text-[var(--text-muted)]" /></button>
              </div>
              <div className="p-5 space-y-4">
                {[["Reviewer Name","reviewerName"],["Role","reviewerRole"],["Organization","organization"],["Image URL","image"],["Date","date"]].map(([label, field]) => (
                  <div key={field}>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">{label}</label>
                    <input type={field === "date" ? "date" : "text"} value={(editing as Record<string, unknown>)[field] as string || ""} onChange={(e) => setEditing((ed) => ({ ...ed, [field]: e.target.value }))} className="input text-sm" />
                  </div>
                ))}
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Review Content</label>
                  <textarea value={editing.content || ""} onChange={(e) => setEditing((ed) => ({ ...ed, content: e.target.value }))} rows={4} className="input text-sm resize-none" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} type="button" onClick={() => setEditing((e) => ({ ...e, rating: n }))} className={`p-1 transition-colors ${n <= (editing.rating || 0) ? "text-[var(--green)]" : "text-[var(--border-default)]"}`}>
                        <Star size={20} className={n <= (editing.rating || 0) ? "fill-[var(--green)]" : ""} />
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${editing.featured ? "bg-[var(--green)]" : "bg-[var(--bg-elevated)]"}`} onClick={() => setEditing((e) => ({ ...e, featured: !e.featured }))}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editing.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">Featured</span>
                </label>
              </div>
              <div className="sticky bottom-0 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] px-5 py-4 flex justify-end gap-3">
                <button onClick={() => setModal(false)} className="btn-outline text-sm">Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary text-sm">
                  {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
