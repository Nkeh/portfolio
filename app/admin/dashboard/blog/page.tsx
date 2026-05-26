"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Save, Loader2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string; title: string; slug: string; summary: string;
  content: string; coverImage?: string; author: string;
  publishedAt: string; published: boolean; tags: string[]; readingTime?: string; views: number;
}
const BLANK: Partial<Post> & { tagInput: string } = {
  title: "", slug: "", summary: "", content: "",
  coverImage: "", author: "Ransom",
  publishedAt: new Date().toISOString().split("T")[0],
  published: false, tags: [], tagInput: "",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<typeof BLANK>({ ...BLANK });
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/blog?all=true").then((r) => r.json()).then((d) => { setPosts(d); setLoading(false); });
  }, []);

  const openNew = () => { setEditing({ ...BLANK }); setEditSlug(null); setModal(true); };
  const openEdit = (p: Post) => {
    setEditing({ ...p, publishedAt: p.publishedAt?.split("T")[0], tagInput: "" });
    setEditSlug(p.slug); setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { tagInput, ...data } = editing;
      const method = editSlug ? "PUT" : "POST";
      const url = editSlug ? `/api/blog/${editSlug}` : "/api/blog";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      if (editSlug) setPosts((ps) => ps.map((p) => (p.slug === editSlug ? updated : p)));
      else setPosts((ps) => [updated, ...ps]);
      setModal(false);
      toast.success(editSlug ? "Post updated!" : "Post created!");
    } catch { toast.error("Failed to save."); }
    setSaving(false);
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setPosts((ps) => ps.filter((p) => p.slug !== slug));
    toast.success("Post deleted.");
  };

  const togglePublish = async (p: Post) => {
    const res = await fetch(`/api/blog/${p.slug}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    if (res.ok) setPosts((ps) => ps.map((post) => post.slug === p.slug ? { ...post, published: !post.published } : post));
  };

  const addTag = () => {
    if ((editing.tagInput || "").trim()) {
      setEditing((e) => ({ ...e, tags: [...(e.tags || []), (e.tagInput || "").trim()], tagInput: "" }));
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-[var(--green)]" /></div>;

  return (
    <div className="pt-14 md:pt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Blog<span className="text-[var(--green)]">.</span></h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={14} /> New Post</button>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-sm truncate">{p.title}</p>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border ${p.published ? "border-[var(--green)] text-[var(--green)]" : "border-[var(--text-muted)] text-[var(--text-muted)]"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)]">{formatDate(p.publishedAt)} · {p.readingTime || "?"} · {p.views} views</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => togglePublish(p)} className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors" title={p.published ? "Unpublish" : "Publish"}>
                {p.published ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button onClick={() => openEdit(p)} className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><Edit2 size={13} /></button>
              <button onClick={() => remove(p.slug)} className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed inset-4 md:inset-8 z-50 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-sm overflow-y-auto">
              <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-display font-bold">{editSlug ? "Edit" : "New"} Blog Post</h2>
                <button onClick={() => setModal(false)}><X size={18} className="text-[var(--text-muted)]" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[["Title","title"],["Slug","slug"],["Author","author"],["Cover Image URL","coverImage"],["Publish Date","publishedAt"]].map(([label, field]) => (
                    <div key={field}>
                      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">{label}</label>
                      <input type={field === "publishedAt" ? "date" : "text"} value={(editing as Record<string, unknown>)[field] as string || ""} onChange={(e) => setEditing((ed) => ({ ...ed, [field]: e.target.value }))} className="input text-sm" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Summary / Excerpt</label>
                  <textarea value={editing.summary || ""} onChange={(e) => setEditing((ed) => ({ ...ed, summary: e.target.value }))} rows={2} className="input text-sm resize-none" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Content (Markdown supported)</label>
                  <textarea value={editing.content || ""} onChange={(e) => setEditing((ed) => ({ ...ed, content: e.target.value }))} rows={14} className="input text-sm resize-none font-mono text-xs" />
                </div>
                {/* Tags */}
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(editing.tags || []).map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 tag text-[10px]">{tag} <button type="button" onClick={() => setEditing((e) => ({ ...e, tags: (e.tags || []).filter((_, idx) => idx !== i) }))}><X size={8} /></button></span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={editing.tagInput || ""} onChange={(e) => setEditing((ed) => ({ ...ed, tagInput: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="input text-sm flex-1" placeholder="Add tag..." />
                    <button type="button" onClick={addTag} className="btn-outline px-3"><Plus size={13} /></button>
                  </div>
                </div>
                {/* Published toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${editing.published ? "bg-[var(--green)]" : "bg-[var(--bg-elevated)]"}`} onClick={() => setEditing((e) => ({ ...e, published: !e.published }))}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editing.published ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">Published</span>
                </label>
              </div>
              <div className="sticky bottom-0 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] px-6 py-4 flex justify-end gap-3">
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
