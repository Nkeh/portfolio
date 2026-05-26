"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight, Layers, Star } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  techStack: string[];
  projectType: string;
  images: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  status: string;
  featured: boolean;
  tags: string[];
  skills: { id: string; name: string }[];
}

const PROJECT_TYPES = ["All", "Web", "AI/ML", "Desktop", "Mobile"];

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.projectType === filter);

  return (
    <section className="min-h-screen pt-[calc(var(--navbar-h)+4rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <FadeIn>
          <div className="section-tag mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
            What I've Built
          </div>
          <h2 className="text-5xl font-display font-bold mb-12">
            Projects<span className="text-[var(--green)]">.</span>
          </h2>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {PROJECT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`font-mono text-xs px-4 py-2 border rounded-sm transition-all duration-200 ${
                  filter === type
                    ? "bg-[var(--green)] border-[var(--green)] text-[var(--bg-primary)]"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--green)] hover:text-[var(--green)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </FadeIn>

        {filtered.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24">
              <Layers size={40} className="text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-muted)] font-mono text-sm">No projects found.</p>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" staggerDelay={0.07}>
            {filtered.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-[var(--bg-elevated)] overflow-hidden">
        {project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display font-bold text-5xl text-[var(--green)] opacity-20">
              {project.title[0]}
            </span>
          </div>
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60" />
        <div className="absolute top-3 right-3 flex gap-2">
          {project.featured && (
            <span className="flex items-center gap-1 font-mono text-[10px] bg-[var(--green)] text-[var(--bg-primary)] px-2 py-1 rounded-sm">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
          <span
            className={`font-mono text-[10px] px-2 py-1 rounded-sm border ${
              project.status === "Ongoing"
                ? "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                : "border-[var(--green)] text-[var(--green)] bg-[var(--green-dim)]"
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-[var(--green)] transition-colors duration-200">
            {project.title}
          </h3>
          <span className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-sm shrink-0">
            {project.projectType}
          </span>
        </div>

        <p className="text-[var(--text-secondary)] text-sm font-body leading-relaxed mb-4 flex-1">
          {project.shortDescription}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="tag text-[10px] py-0.5">{tech}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 font-mono text-xs text-[var(--green)] hover:text-[var(--green-bright)] transition-colors flex-1"
          >
            View Details <ArrowRight size={12} />
          </Link>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"
              >
                <Github size={15} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
