"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Briefcase, Code2, Award, Download,
  ChevronLeft, ChevronRight, Calendar, MapPin, ExternalLink, CheckCircle2
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { formatDateRange } from "@/lib/utils";

type Tab = "education" | "experience" | "skills" | "certifications";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "certifications", label: "Certifications", icon: Award },
];

interface ResumeData {
  education: {
    id: string; institution: string; degree: string; field: string;
    startDate: string; endDate?: string | null; current: boolean;
    description?: string | null; gpa?: string | null;
  }[];
  experience: {
    id: string; company: string; role: string; location?: string | null;
    startDate: string; endDate?: string | null; current: boolean;
    responsibilities: string[]; achievements: string[];
  }[];
  skills: {
    id: string; name: string; category: string; level?: number | null;
  }[];
  certifications: {
    id: string; name: string; issuer: string; issueDate: string;
    expiryDate?: string | null; credentialUrl?: string | null;
  }[];
  resumeUrl?: string | null;
}

export default function ResumeSection({ data }: { data: ResumeData }) {
  const [activeTab, setActiveTab] = useState<Tab>("education");
  const [slideIndex, setSlideIndex] = useState(0);

  const skillCategories = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  const slides = {
    education: data.education,
    experience: data.experience,
    skills: Object.entries(skillCategories),
    certifications: data.certifications,
  };

  const currentSlides = slides[activeTab];
  const currentSlide = currentSlides[slideIndex] || currentSlides[0];
  const totalSlides = currentSlides.length;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSlideIndex(0);
  };

  const next = () => setSlideIndex((i) => (i + 1) % totalSlides);
  const prev = () => setSlideIndex((i) => (i - 1 + totalSlides) % totalSlides);

  return (
    <section className="min-h-screen pt-[calc(var(--navbar-h)+4rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <FadeIn>
          <div className="section-tag mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
            My Journey
          </div>
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-5xl font-display font-bold">
              Resume<span className="text-[var(--green)]">.</span>
            </h2>
            {data.resumeUrl && (
              <a href={data.resumeUrl} download className="btn-outline text-sm">
                <Download size={14} /> Download PDF
              </a>
            )}
          </div>
        </FadeIn>

        {/* Tab Navigation */}
        <FadeIn delay={0.1}>
          <div className="flex gap-1 p-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm mb-10 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-body font-medium rounded-sm transition-all duration-200 ${
                  activeTab === id
                    ? "bg-[var(--green)] text-[var(--bg-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slide list (left) */}
          <FadeIn delay={0.15} className="space-y-2">
            {currentSlides.map((slide, i) => {
              const label =
                activeTab === "education"
                  ? (slide as typeof data.education[0]).institution
                  : activeTab === "experience"
                  ? (slide as typeof data.experience[0]).company
                  : activeTab === "certifications"
                  ? (slide as typeof data.certifications[0]).name
                  : (slide as [string, typeof data.skills])[0];

              const sub =
                activeTab === "education"
                  ? (slide as typeof data.education[0]).degree
                  : activeTab === "experience"
                  ? (slide as typeof data.experience[0]).role
                  : activeTab === "certifications"
                  ? (slide as typeof data.certifications[0]).issuer
                  : `${(slide as [string, typeof data.skills])[1].length} skills`;

              return (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-full text-left p-4 border rounded-sm transition-all duration-200 ${
                    slideIndex === i
                      ? "border-[var(--green)] bg-[var(--green-dim)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-default)]"
                  }`}
                >
                  <p className={`font-display font-semibold text-sm ${slideIndex === i ? "text-[var(--green)]" : "text-[var(--text-primary)]"}`}>
                    {label}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>
                </button>
              );
            })}
          </FadeIn>

          {/* Slide content (right) */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${slideIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card p-8 min-h-[320px]"
              >
                {/* Education slide */}
                {activeTab === "education" && currentSlide && (() => {
                  const e = currentSlide as typeof data.education[0];
                  return (
                    <div>
                      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                          <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">{e.institution}</h3>
                          <p className="text-[var(--green)] font-mono text-sm mt-1">{e.degree} · {e.field}</p>
                        </div>
                        {e.gpa && <span className="tag">{e.gpa} GPA</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-xs mb-6">
                        <Calendar size={11} />
                        {formatDateRange(e.startDate, e.endDate || null, e.current)}
                      </div>
                      {e.description && (
                        <p className="text-[var(--text-secondary)] font-body leading-relaxed">{e.description}</p>
                      )}
                    </div>
                  );
                })()}

                {/* Experience slide */}
                {activeTab === "experience" && currentSlide && (() => {
                  const e = currentSlide as typeof data.experience[0];
                  return (
                    <div>
                      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
                        <div>
                          <h3 className="font-display text-2xl font-bold">{e.role}</h3>
                          <p className="text-[var(--green)] font-mono text-sm mt-1">{e.company}</p>
                        </div>
                        {e.current && <span className="tag">Current</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[var(--text-muted)] font-mono text-xs mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDateRange(e.startDate, e.endDate || null, e.current)}
                        </span>
                        {e.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {e.location}
                          </span>
                        )}
                      </div>
                      {e.responsibilities.length > 0 && (
                        <div className="mb-5">
                          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Responsibilities</p>
                          <ul className="space-y-2">
                            {e.responsibilities.map((r, i) => (
                              <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <span className="text-[var(--green)] shrink-0 mt-0.5">—</span> {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {e.achievements.length > 0 && (
                        <div>
                          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Achievements</p>
                          <ul className="space-y-2">
                            {e.achievements.map((a, i) => (
                              <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <CheckCircle2 size={14} className="text-[var(--green)] shrink-0 mt-0.5" /> {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Skills slide */}
                {activeTab === "skills" && currentSlide && (() => {
                  const [category, skills] = currentSlide as [string, typeof data.skills];
                  return (
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-6">{category}</h3>
                      <StaggerContainer className="space-y-4">
                        {skills.map((skill) => (
                          <StaggerItem key={skill.id}>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-body text-sm text-[var(--text-primary)]">{skill.name}</span>
                                {skill.level && (
                                  <span className="font-mono text-xs text-[var(--text-muted)]">{skill.level}%</span>
                                )}
                              </div>
                              {skill.level && (
                                <div className="h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                    className="h-full bg-[var(--green)] rounded-full"
                                  />
                                </div>
                              )}
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  );
                })()}

                {/* Certifications slide */}
                {activeTab === "certifications" && currentSlide && (() => {
                  const c = currentSlide as typeof data.certifications[0];
                  return (
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-2">{c.name}</h3>
                      <p className="text-[var(--green)] font-mono text-sm mb-4">{c.issuer}</p>
                      <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-xs mb-6">
                        <Calendar size={11} />
                        Issued: {new Date(c.issueDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        {c.expiryDate && ` · Expires: ${new Date(c.expiryDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                      </div>
                      {c.credentialUrl && (
                        <a
                          href={c.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline inline-flex text-sm"
                        >
                          View Credential <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button onClick={prev} className="btn-outline p-2">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`transition-all duration-200 rounded-full ${
                        i === slideIndex
                          ? "w-6 h-1.5 bg-[var(--green)]"
                          : "w-1.5 h-1.5 bg-[var(--border-default)] hover:bg-[var(--green)]"
                      }`}
                    />
                  ))}
                </div>
                <button onClick={next} className="btn-outline p-2">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
