"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [funFacts, setFunFacts] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newFact, setNewFact] = useState("");

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          reset(data);
          setSkills(data.skills || []);
          setInterests(data.interests || []);
          setLanguages(data.languages || []);
          setFunFacts(data.funFacts || []);
        }
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, skills, interests, languages, funFacts }),
      });
      if (!res.ok) throw new Error();
      toast.success("About section updated!");
    } catch {
      toast.error("Failed to save.");
    }
    setSaving(false);
  };

  const addItem = (list: string[], setList: (v: string[]) => void, val: string, setVal: (v: string) => void) => {
    if (val.trim()) { setList([...list, val.trim()]); setVal(""); }
  };
  const removeItem = (list: string[], setList: (v: string[]) => void, i: number) => {
    setList(list.filter((_, idx) => idx !== i));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin text-[var(--green)]" />
    </div>
  );

  return (
    <div className="pt-14 md:pt-0">
      <h1 className="font-display text-3xl font-bold mb-8">
        Edit About<span className="text-[var(--green)]">.</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Full Name</label>
              <input {...register("fullName")} className="input" />
            </div>
            <div>
              <label className="field-label">Title</label>
              <input {...register("title")} className="input" />
            </div>
            <div>
              <label className="field-label">Status</label>
              <input {...register("status")} className="input" placeholder="Open to Opportunities" />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input {...register("location")} className="input" placeholder="Cameroon 🇨🇲" />
            </div>
            <div>
              <label className="field-label">Profile Image URL</label>
              <input {...register("profileImage")} className="input" placeholder="https://..." />
            </div>
            <div>
              <label className="field-label">Resume PDF URL</label>
              <input {...register("resumeUrl")} className="input" placeholder="/resume.pdf" />
            </div>
          </div>
          <div>
            <label className="field-label">Bio (use line breaks for paragraphs)</label>
            <textarea {...register("bio")} rows={6} className="input resize-none" />
          </div>
          <div>
            <label className="field-label">Mission Statement</label>
            <input {...register("mission")} className="input" />
          </div>
        </div>

        {/* Array fields */}
        {[
          { label: "Skills", items: skills, setItems: setSkills, val: newSkill, setVal: setNewSkill },
          { label: "Interests", items: interests, setItems: setInterests, val: newInterest, setVal: setNewInterest },
          { label: "Languages", items: languages, setItems: setLanguages, val: newLang, setVal: setNewLang },
          { label: "Fun Facts", items: funFacts, setItems: setFunFacts, val: newFact, setVal: setNewFact },
        ].map(({ label, items, setItems, val, setVal }) => (
          <div key={label} className="card p-6">
            <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">{label}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 tag">
                  {item}
                  <button type="button" onClick={() => removeItem(items, setItems, i)} className="hover:text-red-400 transition-colors">
                    <Trash2 size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(items, setItems, val, setVal); } }}
                placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                className="input flex-1"
              />
              <button type="button" onClick={() => addItem(items, setItems, val, setVal)} className="btn-outline px-3">
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </form>

      <style jsx>{`
        .field-label { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
      `}</style>
    </div>
  );
}
