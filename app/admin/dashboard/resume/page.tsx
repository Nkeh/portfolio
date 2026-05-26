"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Save, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/lib/utils";

type Section = "education" | "experience" | "skills" | "certifications";

export default function AdminResumePage() {
  const [section, setSection] = useState<Section>("education");
  const [data, setData] = useState<Record<Section, unknown[]>>({ education: [], experience: [], skills: [], certifications: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const API = `/api/resume/${section}`;

  useEffect(() => {
    Promise.all([
      fetch("/api/resume/education").then((r) => r.json()),
      fetch("/api/resume/experience").then((r) => r.json()),
      fetch("/api/resume/skills").then((r) => r.json()),
      fetch("/api/resume/certifications").then((r) => r.json()),
    ]).then(([ed, ex, sk, ce]) => {
      setData({ education: ed, experience: ex, skills: sk, certifications: ce });
      setLoading(false);
    });
  }, []);

  const refresh = () => fetch(API).then((r) => r.json()).then((d) => setData((prev) => ({ ...prev, [section]: d })));

  const openNew = () => { setEditing(defaultFields()); setEditId(null); setModal(true); };
  const openEdit = (item: Record<string, unknown>) => {
    const clean: Record<string, unknown> = { ...item };
    if (clean.startDate) clean.startDate = (clean.startDate as string).split("T")[0];
    if (clean.endDate) clean.endDate = (clean.endDate as string).split("T")[0];
    if (clean.issueDate) clean.issueDate = (clean.issueDate as string).split("T")[0];
    setEditing(clean); setEditId(clean.id as string); setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const res = await fetch(API, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editing, id: editId }) });
      if (!res.ok) throw new Error();
      await refresh();
      setModal(false);
      toast.success("Saved!");
    } catch { toast.error("Failed to save."); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(API, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await refresh();
    toast.success("Deleted.");
  };

  const defaultFields = (): Record<string, unknown> => {
    const today = new Date().toISOString().split("T")[0];
    if (section === "education") return { institution: "", degree: "", field: "", startDate: today, endDate: "", current: false, description: "", gpa: "", order: 0 };
    if (section === "experience") return { company: "", role: "", location: "", startDate: today, endDate: "", current: false, responsibilities: [], achievements: [], order: 0 };
    if (section === "skills") return { name: "", category: "Languages", level: 80 };
    return { name: "", issuer: "", issueDate: today, credentialUrl: "", order: 0 };
  };

  const items = data[section] as Record<string, unknown>[];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-[var(--green)]" /></div>;

  return (
    <div className="pt-14 md:pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Resume<span className="text-[var(--green)]">.</span></h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={14} /> Add</button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm mb-6 w-fit">
        {(["education","experience","skills","certifications"] as Section[]).map((s) => (
          <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 text-xs font-mono rounded-sm capitalize transition-all ${section === s ? "bg-[var(--green)] text-[var(--bg-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const title = (item.institution || item.company || item.name) as string;
          const sub = section === "education" ? `${item.degree} · ${item.field}`
            : section === "experience" ? item.role as string
            : section === "skills" ? `${item.category} · ${item.level || "?"}%`
            : item.issuer as string;
          return (
            <div key={item.id as string} className="card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm truncate">{title}</p>
                <p className="font-mono text-xs text-[var(--text-muted)] truncate">{sub}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><Edit2 size={13} /></button>
                <button onClick={() => remove(item.id as string)} className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-4 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:inset-auto z-50 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-sm overflow-y-auto max-h-[90vh]">
              <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] px-5 py-4 flex items-center justify-between">
                <h2 className="font-display font-bold text-sm capitalize">{editId ? "Edit" : "Add"} {section}</h2>
                <button onClick={() => setModal(false)}><X size={16} className="text-[var(--text-muted)]" /></button>
              </div>
              <div className="p-5 space-y-4">
                {/* Dynamic fields by section */}
                {Object.keys(defaultFields()).filter((k) => !["id","createdAt","updatedAt","responsibilities","achievements"].includes(k)).map((field) => {
                  const val = (editing[field] ?? "") as string | number | boolean;
                  if (typeof val === "boolean") return (
                    <label key={field} className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${val ? "bg-[var(--green)]" : "bg-[var(--bg-elevated)]"}`} onClick={() => setEditing((e) => ({ ...e, [field]: !val }))}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${val ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                      <span className="font-mono text-xs text-[var(--text-secondary)] capitalize">{field}</span>
                    </label>
                  );
                  const isDate = field.toLowerCase().includes("date");
                  return (
                    <div key={field}>
                      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                      <input type={isDate ? "date" : typeof val === "number" ? "number" : "text"} value={val as string} onChange={(e) => setEditing((ed) => ({ ...ed, [field]: typeof val === "number" ? Number(e.target.value) : e.target.value }))} className="input text-sm" />
                    </div>
                  );
                })}
                {/* Array fields for experience */}
                {section === "experience" && ["responsibilities","achievements"].map((field) => (
                  <div key={field}>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2 capitalize">{field}</label>
                    {((editing[field] as string[]) || []).map((item, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={item} onChange={(e) => { const arr = [...((editing[field] as string[]) || [])]; arr[i] = e.target.value; setEditing((ed) => ({ ...ed, [field]: arr })); }} className="input text-sm flex-1" />
                        <button type="button" onClick={() => setEditing((e) => ({ ...e, [field]: ((e[field] as string[]) || []).filter((_, idx) => idx !== i) }))} className="p-2 text-[var(--text-muted)] hover:text-red-400"><X size={13} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setEditing((e) => ({ ...e, [field]: [...((e[field] as string[]) || []), ""] }))} className="btn-outline text-xs py-1.5"><Plus size={11} /> Add</button>
                  </div>
                ))}
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
