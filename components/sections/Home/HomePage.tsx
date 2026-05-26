"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, Download, MapPin, Globe, ChevronLeft, ChevronRight,
  ExternalLink, Github, Star, Clock, Eye, Send, Loader2,
  CheckCircle, Zap, GraduationCap, Briefcase, Mail, Linkedin, Twitter,
  BookOpen, MessageSquare, Code2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { formatDate, formatDateRange } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AboutData {
  fullName: string; title: string; profileImage?: string | null; bio: string;
  skills: string[]; interests: string[]; mission: string; status: string;
  location?: string | null; languages: string[]; funFacts: string[]; resumeUrl?: string | null;
}
interface Education { id: string; institution: string; degree: string; field: string; startDate: string; endDate?: string | null; current: boolean; description?: string | null; }
interface Experience { id: string; company: string; role: string; location?: string | null; startDate: string; endDate?: string | null; current: boolean; responsibilities: string[]; achievements: string[]; }
interface Skill { id: string; name: string; category: string; level?: number | null; }
interface Project { id: string; title: string; slug: string; shortDescription: string; techStack: string[]; projectType: string; images: string[]; demoUrl?: string | null; githubUrl?: string | null; status: string; featured: boolean; skills: { id: string; name: string }[]; }
interface BlogPost { id: string; title: string; slug: string; summary: string; coverImage?: string | null; publishedAt: string; tags: string[]; readingTime?: string | null; views: number; }
interface Review { id: string; reviewerName: string; reviewerRole: string; organization: string; content: string; rating?: number | null; image?: string | null; date: string; }

interface HomePageProps {
  about: AboutData; education: Education[]; experience: Experience[];
  skills: Skill[]; projects: Project[]; posts: BlogPost[]; reviews: Review[];
}

// Contact form schema
const schema = z.object({
  name: z.string().min(2), email: z.string().email(),
  subject: z.string().min(5), message: z.string().min(20),
});
type FormData = z.infer<typeof schema>;

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-24 relative ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ tag, title, subtitle }: { tag: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <FadeIn className="mb-14">
      <div className="section-tag mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />{tag}
      </div>
      <h2 className="text-4xl md:text-5xl font-display font-bold mb-3">{title}</h2>
      {subtitle && <p className="text-[var(--text-secondary)] font-body max-w-xl">{subtitle}</p>}
    </FadeIn>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage({ about, education, experience, skills, projects, posts, reviews }: HomePageProps) {
  const bioLines = about.bio.split("\n").filter(Boolean);
  const skillCategories = skills.reduce((acc, s) => { if (!acc[s.category]) acc[s.category] = []; acc[s.category].push(s); return acc; }, {} as Record<string, Skill[]>);
  const [projectIndex, setProjectIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [contactDone, setContactDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setContactDone(true); reset();
      toast.success("Message sent!");
    } catch { toast.error("Failed to send. Please try again."); }
  };

  const visibleProjects = 3;
  const projectPages = Math.ceil(projects.length / visibleProjects);
  const currentProjects = projects.slice(projectIndex * visibleProjects, projectIndex * visibleProjects + visibleProjects);

  return (
    <div className="relative overflow-x-hidden">
      {/* ── HERO / ABOUT ─────────────────────────────────────────────────────── */}
      <section id="about" className="relative min-h-screen flex items-center pt-[var(--navbar-h)] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-[-80px] w-[500px] h-[500px] rounded-full bg-[var(--green)] blur-[130px] pointer-events-none" />

        <div className="section-container relative z-10 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="section-tag mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />{about.status}
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
                className="text-5xl sm:text-6xl xl:text-7xl font-display font-bold leading-[0.95] mb-3">
                Hey, I'm{" "}<span className="text-[var(--green)] text-glow">Bonya Ransom</span><span className="text-[var(--green)]">.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="font-mono text-[var(--text-secondary)] mb-8 tracking-tight">{about.title}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.32 }} className="space-y-4 mb-10">
                {bioLines.map((line, i) => <p key={i} className="text-[var(--text-secondary)] font-body leading-relaxed">{line}</p>)}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.44 }} className="flex flex-wrap gap-2 mb-10">
                {about.location && <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-sm"><MapPin size={11} className="text-[var(--green)]" />{about.location}</span>}
                <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-sm"><Globe size={11} className="text-[var(--green)]" />{about.languages.join(" / ")}</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.54 }} className="flex flex-wrap gap-3">
                <a href="#projects" className="btn-primary">See My Work <ArrowRight size={14} /></a>
                <Link href="/about" className="btn-outline">About Me</Link>
                {about.resumeUrl && <a href={about.resumeUrl} download className="btn-outline"><Download size={14} /> Download CV</a>}
              </motion.div>
            </div>

            {/* Profile image */}
            <FadeIn direction="left" delay={0.2}>
              <div className="relative w-full max-w-sm mx-auto lg:ml-auto">
                <div className="relative aspect-square rounded-sm overflow-hidden border border-[var(--border-default)] glow-green">
                  {about.profileImage
                    ? <Image src={about.profileImage} alt={about.fullName} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)] grid-bg">
                        <span className="font-display font-bold text-[120px] text-[var(--green)] opacity-20 leading-none select-none">R</span>
                      </div>
                  }
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--green)]" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--green)]" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--green)]" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--green)]" />
                </div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-5 -left-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-sm px-4 py-3 hidden sm:block">
                  <p className="font-mono text-xs text-[var(--text-muted)]">Projects</p>
                  <p className="font-display font-bold text-2xl text-[var(--green)]">10+</p>
                </motion.div>
                <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="absolute -top-4 -right-5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-sm px-4 py-3 hidden sm:block">
                  <p className="font-mono text-xs text-[var(--text-muted)]">Experience</p>
                  <p className="font-display font-bold text-2xl text-[var(--green)]">3yr+</p>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Skills strip */}
          <FadeIn delay={0.5} className="mt-20">
            <div className="border-t border-b border-[var(--border-subtle)] py-8">
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-5">Tech Proficiencies</p>
              <StaggerContainer className="flex flex-wrap gap-2" staggerDelay={0.04}>
                {about.skills.map((s) => <StaggerItem key={s}><span className="tag">{s}</span></StaggerItem>)}
              </StaggerContainer>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── RESUME ───────────────────────────────────────────────────────────── */}
      <Section id="resume">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="section-container relative z-10">
          <SectionHeader tag="My Journey" title={<>Resume<span className="text-[var(--green)]">.</span></>} subtitle="A snapshot of my education, experience, and expertise." />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Education */}
            <FadeIn delay={0.0}>
              <div className="h-full">
                <div className="flex items-center gap-2 mb-5">
                  <GraduationCap size={16} className="text-[var(--green)]" />
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Education</p>
                </div>
                <div className="space-y-3">
                  {education.length === 0
                    ? <div className="card p-5 text-center"><p className="font-mono text-xs text-[var(--text-muted)]">No entries yet.</p></div>
                    : education.map((e) => (
                      <div key={e.id} className="card p-5">
                        <p className="font-display font-semibold text-sm text-[var(--text-primary)]">{e.institution}</p>
                        <p className="font-mono text-xs text-[var(--green)] mt-0.5">{e.degree}</p>
                        <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{formatDateRange(e.startDate, e.endDate || null, e.current)}</p>
                        {e.description && <p className="font-body text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{e.description}</p>}
                      </div>
                    ))
                  }
                </div>
              </div>
            </FadeIn>

            {/* Experience */}
            <FadeIn delay={0.1}>
              <div className="h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Briefcase size={16} className="text-[var(--green)]" />
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Experience</p>
                </div>
                <div className="space-y-3">
                  {experience.length === 0
                    ? <div className="card p-5 text-center"><p className="font-mono text-xs text-[var(--text-muted)]">No entries yet.</p></div>
                    : experience.map((e) => (
                      <div key={e.id} className="card p-5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display font-semibold text-sm">{e.role}</p>
                          {e.current && <span className="tag text-[10px] py-0 shrink-0">Now</span>}
                        </div>
                        <p className="font-mono text-xs text-[var(--green)] mt-0.5">{e.company}</p>
                        <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{formatDateRange(e.startDate, e.endDate || null, e.current)}</p>
                        {e.responsibilities.slice(0, 2).map((r, i) => (
                          <div key={i} className="flex gap-2 mt-2">
                            <span className="text-[var(--green)] text-xs shrink-0">—</span>
                            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed">{r}</p>
                          </div>
                        ))}
                      </div>
                    ))
                  }
                </div>
              </div>
            </FadeIn>

            {/* Skills */}
            <FadeIn delay={0.2}>
              <div className="h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Code2 size={16} className="text-[var(--green)]" />
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Skills</p>
                </div>
                {skills.length === 0
                  ? <div className="card p-5 text-center"><p className="font-mono text-xs text-[var(--text-muted)]">No skills yet.</p></div>
                  : <div className="card p-5 space-y-5">
                      {Object.entries(skillCategories).slice(0, 4).map(([cat, catSkills]) => (
                        <div key={cat}>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">{cat}</p>
                          <div className="space-y-2">
                            {catSkills.slice(0, 4).map((skill) => (
                              <div key={skill.id}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-body text-xs text-[var(--text-secondary)]">{skill.name}</span>
                                  {skill.level && <span className="font-mono text-[10px] text-[var(--text-muted)]">{skill.level}%</span>}
                                </div>
                                {skill.level && (
                                  <div className="h-0.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full bg-[var(--green)] rounded-full" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="mt-8 text-center">
            <Link href="/resume" className="btn-outline">View Full Resume <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </Section>

      {/* ── PROJECTS ─────────────────────────────────────────────────────────── */}
      <Section id="projects">
        <div className="section-container relative z-10">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <FadeIn>
              <div className="section-tag mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />What I've Built</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Projects<span className="text-[var(--green)]">.</span></h2>
            </FadeIn>
            <FadeIn delay={0.1}><Link href="/projects" className="btn-outline text-sm">View All <ArrowRight size={13} /></Link></FadeIn>
          </div>

          {/* Project cards */}
          <AnimatePresence mode="wait">
            <motion.div key={projectIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentProjects.map((project) => (
                <motion.div key={project.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card group flex flex-col overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44 bg-[var(--bg-elevated)] overflow-hidden">
                    {project.images[0]
                      ? <Image src={project.images[0]} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="w-full h-full flex items-center justify-center"><span className="font-display font-bold text-5xl text-[var(--green)] opacity-20">{project.title[0]}</span></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60" />
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {project.featured && <span className="font-mono text-[10px] bg-[var(--green)] text-[var(--bg-primary)] px-2 py-0.5 rounded-sm">★ Featured</span>}
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border ${project.status === "Ongoing" ? "border-yellow-500 text-yellow-500" : "border-[var(--green)] text-[var(--green)]"}`}>{project.status}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-base leading-tight mb-2 group-hover:text-[var(--green)] transition-colors">{project.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-body leading-relaxed mb-4 flex-1">{project.shortDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.slice(0, 3).map((t) => <span key={t} className="tag text-[10px] py-0.5">{t}</span>)}
                      {project.techStack.length > 3 && <span className="font-mono text-[10px] text-[var(--text-muted)] self-center">+{project.techStack.length - 3}</span>}
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                      <Link href={`/projects/${project.slug}`} className="flex items-center gap-1.5 font-mono text-xs text-[var(--green)] hover:text-[var(--green-bright)] transition-colors flex-1">Details <ArrowRight size={11} /></Link>
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><Github size={13} /></a>}
                      {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"><ExternalLink size={13} /></a>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {projectPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={() => setProjectIndex((i) => (i - 1 + projectPages) % projectPages)} className="btn-outline p-2"><ChevronLeft size={16} /></button>
              <div className="flex gap-2">
                {Array.from({ length: projectPages }).map((_, i) => (
                  <button key={i} onClick={() => setProjectIndex(i)} className={`transition-all rounded-full ${i === projectIndex ? "w-6 h-1.5 bg-[var(--green)]" : "w-1.5 h-1.5 bg-[var(--border-default)] hover:bg-[var(--green)]"}`} />
                ))}
              </div>
              <button onClick={() => setProjectIndex((i) => (i + 1) % projectPages)} className="btn-outline p-2"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </Section>

      {/* ── BLOG ─────────────────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <Section id="blog">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="section-container relative z-10">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
              <FadeIn>
                <div className="section-tag mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />Thoughts & Tutorials</div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">Blog<span className="text-[var(--green)]">.</span></h2>
              </FadeIn>
              <FadeIn delay={0.1}><Link href="/blog" className="btn-outline text-sm">All Posts <ArrowRight size={13} /></Link></FadeIn>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5" staggerDelay={0.07}>
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="card group h-full flex overflow-hidden">
                      {post.coverImage && (
                        <div className="relative w-32 shrink-0 bg-[var(--bg-elevated)]">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        {post.tags[0] && <span className="tag text-[10px] py-0.5 mb-2 self-start">{post.tags[0]}</span>}
                        <h3 className="font-display font-bold text-sm leading-tight mb-2 group-hover:text-[var(--green)] transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-[var(--text-secondary)] text-xs font-body leading-relaxed flex-1 line-clamp-2">{post.summary}</p>
                        <div className="flex items-center gap-3 mt-3 text-[var(--text-muted)] font-mono text-[10px]">
                          <span className="flex items-center gap-1"><Clock size={9} />{post.readingTime || "?"}</span>
                          <span className="flex items-center gap-1"><Eye size={9} />{post.views}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Section>
      )}

      {/* ── REVIEWS ──────────────────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <Section id="reviews">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-[var(--green)] blur-[120px] pointer-events-none" />
          <div className="section-container relative z-10">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
              <FadeIn>
                <div className="section-tag mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />What People Say</div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">Reviews<span className="text-[var(--green)]">.</span></h2>
              </FadeIn>
              <FadeIn delay={0.1}><Link href="/reviews" className="btn-outline text-sm">All Reviews <ArrowRight size={13} /></Link></FadeIn>
            </div>

            <FadeIn delay={0.1}>
              {/* Featured review */}
              <AnimatePresence mode="wait">
                <motion.div key={reviewIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
                  className="card p-8 md:p-10 relative overflow-hidden mb-6">
                  <MessageSquare size={70} className="absolute top-5 right-5 text-[var(--green)] opacity-[0.04]" strokeWidth={1} />
                  {reviews[reviewIndex]?.rating && (
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < (reviews[reviewIndex].rating ?? 0) ? "text-[var(--green)] fill-[var(--green)]" : "text-[var(--border-default)]"} />
                      ))}
                    </div>
                  )}
                  <p className="font-body text-lg md:text-xl text-[var(--text-primary)] leading-relaxed mb-7 max-w-3xl">&ldquo;{reviews[reviewIndex]?.content}&rdquo;</p>
                  <div className="flex items-center gap-4 flex-wrap justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--green-dim)] border border-[var(--border-default)] flex items-center justify-center">
                        <span className="font-display font-bold text-sm text-[var(--green)]">{reviews[reviewIndex]?.reviewerName[0]}</span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm">{reviews[reviewIndex]?.reviewerName}</p>
                        <p className="font-mono text-xs text-[var(--text-muted)]">{reviews[reviewIndex]?.reviewerRole} · <span className="text-[var(--green)]">{reviews[reviewIndex]?.organization}</span></p>
                      </div>
                    </div>
                    {reviews.length > 1 && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => setReviewIndex((i) => (i - 1 + reviews.length) % reviews.length)} className="btn-outline p-2"><ChevronLeft size={14} /></button>
                        <div className="flex gap-1.5">
                          {reviews.map((_, i) => <button key={i} onClick={() => setReviewIndex(i)} className={`rounded-full transition-all ${i === reviewIndex ? "w-5 h-1.5 bg-[var(--green)]" : "w-1.5 h-1.5 bg-[var(--border-default)]"}`} />)}
                        </div>
                        <button onClick={() => setReviewIndex((i) => (i + 1) % reviews.length)} className="btn-outline p-2"><ChevronRight size={14} /></button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Mini grid */}
              {reviews.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {reviews.map((r, i) => (
                    <button key={r.id} onClick={() => setReviewIndex(i)} className={`card p-4 text-left transition-all ${i === reviewIndex ? "border-[var(--green)] bg-[var(--green-dim)]" : "hover:border-[var(--border-default)]"}`}>
                      {r.rating && <div className="flex gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, si) => <Star key={si} size={9} className="text-[var(--green)] fill-[var(--green)]" />)}</div>}
                      <p className="font-body text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">&ldquo;{r.content}&rdquo;</p>
                      <p className="font-display font-semibold text-xs text-[var(--text-primary)]">{r.reviewerName}</p>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">{r.organization}</p>
                    </button>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>
        </Section>
      )}

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <Section id="contact">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--green)] blur-[140px] pointer-events-none" />
        <div className="section-container relative z-10">
          <SectionHeader tag="Let's Talk" title={<>Contact<span className="text-[var(--green)]">.</span></>} subtitle="Have a project in mind, or just want to say hi? I'll get back within 24 hours." />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <FadeIn delay={0.1} className="lg:col-span-2 space-y-6">
              {[
                { icon: Mail, label: "Email", val: "ransom@example.com", href: "mailto:ransom@example.com" },
                { icon: MapPin, label: "Location", val: about.location || "Cameroon 🇨🇲", href: null },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[var(--border-default)] bg-[var(--bg-card)] flex items-center justify-center rounded-sm shrink-0">
                    <Icon size={14} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{label}</p>
                    {href ? <a href={href} className="font-body text-sm text-[var(--text-primary)] hover:text-[var(--green)] transition-colors">{val}</a>
                      : <p className="font-body text-sm text-[var(--text-primary)]">{val}</p>}
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                {[
                  { icon: Github, href: "https://github.com/ransom" },
                  { icon: Linkedin, href: "https://linkedin.com/in/ransom" },
                  { icon: Twitter, href: "https://twitter.com/ransom" },
                ].map(({ icon: Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--green)] hover:border-[var(--green)] hover:bg-[var(--green-dim)] transition-all rounded-sm">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
              <div className="card p-4 border-[var(--green)] bg-[var(--green-dim)]">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
                  <div>
                    <p className="font-display font-semibold text-[var(--green)] text-sm">Available for Work</p>
                    <p className="font-mono text-xs text-[var(--text-secondary)]">Open to freelance & full-time</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.2} className="lg:col-span-3">
              {contactDone ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 flex flex-col items-center justify-center text-center min-h-[360px]">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                    className="w-14 h-14 rounded-full bg-[var(--green-dim)] border border-[var(--green)] flex items-center justify-center mb-5">
                    <CheckCircle size={24} className="text-[var(--green)]" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-[var(--text-secondary)] font-body text-sm mb-5">Thanks for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setContactDone(false)} className="btn-outline text-sm">Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="card p-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Name</label>
                      <input {...register("name")} placeholder="John Doe" className="input" />
                      {errors.name && <p className="font-mono text-xs text-red-400 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Email</label>
                      <input {...register("email")} type="email" placeholder="john@example.com" className="input" />
                      {errors.email && <p className="font-mono text-xs text-red-400 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Subject</label>
                    <input {...register("subject")} placeholder="Project collaboration..." className="input" />
                    {errors.subject && <p className="font-mono text-xs text-red-400 mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Message</label>
                    <textarea {...register("message")} placeholder="Tell me about your project..." rows={5} className="input resize-none" />
                    {errors.message && <p className="font-mono text-xs text-red-400 mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5">
                    {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send Message</>}
                  </button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </Section>
    </div>
  );
}
