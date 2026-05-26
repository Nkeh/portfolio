"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Save, Loader2, ExternalLink, Github } from "lucide-react";

interface Skill { id: string; name: string; category: string; }
interface Project {
  id: string; title: string; slug: string; shortDescription: string;
  fullDescription: string; techStack: string[]; projectType: string;
  images: string[]; demoUrl?: string; githubUrl?: string;
  date: string; status: string; keyFeatures: string[];
  challenges?: string; solutions?: string; role?: string;
  tags: string[]; featured: boolean;
  skills: Skill[];
}

const BLANK: Partial<Project> & { skillIds: string[] } = {
  title: "", slug: "", shortDescription: "", fullDescription: "",
  techStack: [], projectType: "Web", images: [], demoUrl: "", githubUrl: "",
  date: new Date().toISOString().split("T")[0], status: "Completed",
  keyFeatures: [], challenges: "", solutions: "", role: "", tags: [], featured: false, skillIds: [],
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<typeof BLANK>({ ...BLANK });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newTech, setNewTech] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/projects?all=true").then((r) => r.json()),
      fetch("/api/resume/skills").then((r) => r.json()),
    ]).then(([p, s]) => { setProjects(p); setAllSkills(s); setLoading(false); });
  }, []);

  const openNew = () => { setEditing({ ...BLANK }); setEditId(null); setModal(true); };
  const openEdit = (p: Project) => {
    setEditing({ ...p, skillIds: p.skills.map((s) => s.id), date: p.date?.split("T")[0] });
    setEditId(p.id); setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/projects/${editId}` : "/api/projects";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      if (editId) setProjects((ps) => ps.map((p) => (p.id === editId ? updated : p)));
      else setProjects((ps) => [updated, ...ps]);
      setModal(false);
      toast.success(editId ? "Project updated!" : "Project created!");
    } catch { toast.error("Failed to save."); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((ps) => ps.filter((p) => p.id !== id));
    toast.success("Project deleted.");
  };

  const addArr = (field: keyof typeof editing, val: string, setVal: (v: string) => void) => {
    if (!val.trim()) return;
    setEditing((e) => ({ ...e, [field]: [...((e[field] as string[]) || []), val.trim()] }));
    setVal("");
  };
  const removeArr = (field: keyof typeof editing, i: number) => {
    setEditing((e) => ({ ...e, [field]: ((e[field] as string[]) || []).filter((_, idx) => idx !== i) }));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-[var(--green)]" /></div>;

  return (
    <div className="pt-14 md:pt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Projects<span className="text-[var(--green)]">.</span></h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={14} /> New Project</button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-display font-semibold text-sm truncate">{p.title}</p>
                {p.featured && <span className="tag text-[10px] py-0">Featured</span>}
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border ${p.status === "Ongoing" ? "border-yellow-500 text-yellow-500" : "border-[var(--green)] text-[var(--green)]"}`}>{p.status}</span>
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)]">{p.projectType} · {p.techStack.slice(0, 3).join(", ")}</p>
            </div>
            <div className="flex gap-1">
              {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><ExternalLink size={13} /></a>}
              {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><Github size={13} /></a>}
              <button onClick={() => openEdit(p)} className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><Edit2 size={13} /></button>
              <button onClick={() => remove(p.id)} className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-8 z-50 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-sm overflow-y-auto">
              <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-display font-bold">{editId ? "Edit" : "New"} Project</h2>
                <button onClick={() => setModal(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["Title", "title", "text"], ["Slug", "slug", "text"],
                    ["Project Type", "projectType", "text"], ["Status", "status", "text"],
                    ["Demo URL", "demoUrl", "text"], ["GitHub URL", "githubUrl", "text"],
                    ["Date", "date", "date"], ["Role", "role", "text"],
                  ].map(([label, field, type]) => (
                    <div key={field}>
                      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">{label}</label>
                      <input type={type} value={(editing as Record<string, unknown>)[field] as string || ""} onChange={(e) => setEditing((ed) => ({ ...ed, [field]: e.target.value }))} className="input text-sm" />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Short Description</label>
                  <input value={editing.shortDescription || ""} onChange={(e) => setEditing((ed) => ({ ...ed, shortDescription: e.target.value }))} className="input text-sm" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Full Description</label>
                  <textarea value={editing.fullDescription || ""} onChange={(e) => setEditing((ed) => ({ ...ed, fullDescription: e.target.value }))} rows={4} className="input text-sm resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Challenges</label>
                    <textarea value={editing.challenges || ""} onChange={(e) => setEditing((ed) => ({ ...ed, challenges: e.target.value }))} rows={3} className="input text-sm resize-none" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">Solutions</label>
                    <textarea value={editing.solutions || ""} onChange={(e) => setEditing((ed) => ({ ...ed, solutions: e.target.value }))} rows={3} className="input text-sm resize-none" />
                  </div>
                </div>

                {/* Array fields */}
                {([
                  ["Tech Stack", "techStack", newTech, setNewTech],
                  ["Key Features", "keyFeatures", newFeature, setNewFeature],
                  ["Tags", "tags", newTag, setNewTag],
                  ["Images (URLs)", "images", newImage, setNewImage],
                ] as const).map(([label, field, val, setVal]: [string, "techStack"|"keyFeatures"|"tags"|"images", string, (v: string) => void]) => (
                  <div key={field}>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">{label}</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {((editing[field] as string[]) || []).map((item: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 tag text-[10px]">
                          {item.length > 40 ? item.slice(0, 40) + "…" : item}
                          <button type="button" onClick={() => removeArr(field, i)}><X size={8} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArr(field, val, setVal); } }} className="input text-sm flex-1" placeholder={`Add ${label.toLowerCase()}...`} />
                      <button type="button" onClick={() => addArr(field, val, setVal)} className="btn-outline px-3 py-2"><Plus size={13} /></button>
                    </div>
                  </div>
                ))}

                {/* Skills */}
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => {
                      const selected = (editing.skillIds || []).includes(skill.id);
                      return (
                        <button key={skill.id} type="button" onClick={() => setEditing((e) => ({ ...e, skillIds: selected ? (e.skillIds || []).filter((id) => id !== skill.id) : [...(e.skillIds || []), skill.id] }))}
                          className={`font-mono text-xs px-3 py-1.5 border rounded-sm transition-all ${selected ? "bg-[var(--green)] border-[var(--green)] text-[var(--bg-primary)]" : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--green)]"}`}>
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Featured */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${editing.featured ? "bg-[var(--green)]" : "bg-[var(--bg-elevated)]"}`} onClick={() => setEditing((e) => ({ ...e, featured: !e.featured }))}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editing.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">Featured project</span>
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
