"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Download, ArrowRight, Globe, Zap, Lightbulb } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

interface AboutData {
  fullName: string; title: string; profileImage?: string | null; bio: string;
  skills: string[]; interests: string[]; mission: string; status: string;
  location?: string | null; languages: string[]; funFacts: string[]; resumeUrl?: string | null;
}

export default function AboutSection({ data }: { data: AboutData }) {
  const bioLines = data.bio.split("\n").filter(Boolean);

  return (
    <section className="relative min-h-screen flex items-center pt-[var(--navbar-h)] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Ambient orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-[-80px] w-[480px] h-[480px] rounded-full bg-[var(--green)] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-40px] w-[250px] h-[250px] rounded-full bg-[var(--green)] blur-[100px] opacity-[0.04] pointer-events-none" />

      <div className="section-container relative z-10 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="section-tag mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />{data.status}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl sm:text-6xl xl:text-7xl font-display font-bold leading-[0.95] mb-3">
              Hey, I'm{" "}<span className="text-[var(--green)] text-glow">Ransom</span><span className="text-[var(--green)]">.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
              className="font-mono text-[var(--text-secondary)] text-base mb-8 tracking-tight">
              {data.title}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }} className="space-y-4 mb-10">
              {bioLines.map((line, i) => (
                <p key={i} className="text-[var(--text-secondary)] font-body leading-relaxed">{line}</p>
              ))}
            </motion.div>

            {/* Info pills */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }} className="flex flex-wrap gap-2 mb-10">
              {data.location && (
                <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-sm">
                  <MapPin size={11} className="text-[var(--green)]" />{data.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-sm">
                <Globe size={11} className="text-[var(--green)]" />{data.languages.join(" / ")}
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.55 }} className="flex flex-wrap gap-4">
              <Link href="/projects" className="btn-primary">View Projects <ArrowRight size={14} /></Link>
              {data.resumeUrl && (
                <a href={data.resumeUrl} download className="btn-outline"><Download size={14} /> Download CV</a>
              )}
            </motion.div>
          </div>

          {/* Right — profile image */}
          <FadeIn direction="left" delay={0.2}>
            <div className="relative w-full max-w-sm mx-auto lg:ml-auto">
              <div className="relative aspect-square rounded-sm overflow-hidden border border-[var(--border-default)] glow-green">
                {data.profileImage ? (
                  <Image src={data.profileImage} alt={data.fullName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)] grid-bg">
                    <span className="font-display font-bold text-[120px] text-[var(--green)] opacity-20 leading-none select-none">R</span>
                  </div>
                )}
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--green)]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--green)]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--green)]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--green)]" />
              </div>
              {/* Floating stat cards */}
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
        <FadeIn delay={0.6} className="mt-20">
          <div className="border-t border-b border-[var(--border-subtle)] py-8">
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-5">Tech Proficiencies</p>
            <StaggerContainer className="flex flex-wrap gap-2" staggerDelay={0.04}>
              {data.skills.map((skill) => (
                <StaggerItem key={skill}><span className="tag">{skill}</span></StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* Mission + Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <FadeIn delay={0.1}>
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} className="text-[var(--green)]" />
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Mission</p>
              </div>
              <p className="font-body text-[var(--text-secondary)] italic leading-relaxed">&ldquo;{data.mission}&rdquo;</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} className="text-[var(--green)]" />
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Interests</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.interests.map((i) => <span key={i} className="tag">{i}</span>)}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Fun facts */}
        {data.funFacts.length > 0 && (
          <FadeIn delay={0.1} className="mt-5">
            <div className="card p-6">
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-5">Fun Facts</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {data.funFacts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[var(--green)] text-sm font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-body text-sm text-[var(--text-secondary)]">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
