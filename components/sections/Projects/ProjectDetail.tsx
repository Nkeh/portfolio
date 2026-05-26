"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ExternalLink, Github, Calendar, CheckCircle2,
  Lightbulb, User, Tag, ChevronLeft, ChevronRight
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { formatDate } from "@/lib/utils";

interface ProjectDetailProps {
  project: {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    techStack: string[];
    projectType: string;
    images: string[];
    demoUrl?: string | null;
    githubUrl?: string | null;
    date: string;
    status: string;
    keyFeatures: string[];
    challenges?: string | null;
    solutions?: string | null;
    role?: string | null;
    tags: string[];
    videoUrl?: string | null;
    skills: { id: string; name: string; category: string }[];
  };
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <article className="min-h-screen pt-[calc(var(--navbar-h)+2rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="section-container relative z-10">
        {/* Back */}
        <FadeIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--green)] font-mono text-xs transition-colors mb-8"
          >
            <ArrowLeft size={13} /> Back to Projects
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="xl:col-span-2">
            <FadeIn>
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <span className="section-tag">{project.projectType}</span>
                <span className={`font-mono text-xs px-3 py-1 border rounded-sm ${
                  project.status === "Ongoing"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-[var(--green)] text-[var(--green)]"
                }`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">{project.title}</h1>
              <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed mb-8">
                {project.shortDescription}
              </p>
            </FadeIn>

            {/* Image gallery */}
            {project.images.length > 0 && (
              <FadeIn delay={0.1} className="mb-10">
                <div className="relative aspect-video bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm overflow-hidden">
                  <Image
                    src={project.images[imgIndex]}
                    alt={`${project.title} screenshot ${imgIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIndex((i) => (i - 1 + project.images.length) % project.images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--bg-primary)]/80 border border-[var(--border-default)] rounded-sm text-[var(--text-primary)] hover:text-[var(--green)] transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setImgIndex((i) => (i + 1) % project.images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--bg-primary)]/80 border border-[var(--border-default)] rounded-sm text-[var(--text-primary)] hover:text-[var(--green)] transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {project.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={`rounded-full transition-all ${i === imgIndex ? "w-5 h-1.5 bg-[var(--green)]" : "w-1.5 h-1.5 bg-white/40"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </FadeIn>
            )}

            {/* Full description */}
            <FadeIn delay={0.15}>
              <div className="card p-6 mb-6">
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Overview</p>
                <div className="prose-dark">
                  <p className="text-[var(--text-secondary)] font-body leading-relaxed whitespace-pre-wrap">
                    {project.fullDescription}
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Key features */}
            {project.keyFeatures.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="card p-6 mb-6">
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Key Features</p>
                  <StaggerContainer className="space-y-3">
                    {project.keyFeatures.map((feat, i) => (
                      <StaggerItem key={i}>
                        <div className="flex gap-3">
                          <CheckCircle2 size={15} className="text-[var(--green)] shrink-0 mt-0.5" />
                          <p className="text-[var(--text-secondary)] text-sm font-body">{feat}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeIn>
            )}

            {/* Challenges & Solutions */}
            {(project.challenges || project.solutions) && (
              <FadeIn delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {project.challenges && (
                    <div className="card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={14} className="text-yellow-500" />
                        <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Challenges</p>
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm font-body leading-relaxed">{project.challenges}</p>
                    </div>
                  )}
                  {project.solutions && (
                    <div className="card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 size={14} className="text-[var(--green)]" />
                        <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Solutions</p>
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm font-body leading-relaxed">{project.solutions}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <FadeIn delay={0.2} direction="left">
            <div className="space-y-4 lg:sticky lg:top-[calc(var(--navbar-h)+1rem)]">
              {/* Links */}
              <div className="card p-5">
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Links</p>
                <div className="space-y-2">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center text-sm">
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center text-sm">
                      <Github size={14} /> Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="card p-5 space-y-4">
                <div>
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">Date</p>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Calendar size={12} className="text-[var(--green)]" />
                    {formatDate(project.date)}
                  </div>
                </div>
                {project.role && (
                  <div>
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">My Role</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <User size={12} className="text-[var(--green)]" />
                      {project.role}
                    </div>
                  </div>
                )}
                {project.tags.length > 0 && (
                  <div>
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 tag text-[10px]">
                          <Tag size={8} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tech stack */}
              <div className="card p-5">
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {project.skills.length > 0 && (
                <div className="card p-5">
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Skills Used</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill) => (
                      <span key={skill.id} className="tag">{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </article>
  );
}
