"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage?: string | null;
  author: string;
  publishedAt: string;
  tags: string[];
  readingTime?: string | null;
  views: number;
}

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  const [activeTag, setActiveTag] = useState("All");

  const allTags = ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags)))];
  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <section className="min-h-screen pt-[calc(var(--navbar-h)+4rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <FadeIn>
          <div className="section-tag mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
            Thoughts & Tutorials
          </div>
          <h2 className="text-5xl font-display font-bold mb-12">
            Blog<span className="text-[var(--green)]">.</span>
          </h2>
        </FadeIn>

        {/* Tag filters */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`font-mono text-xs px-4 py-2 border rounded-sm transition-all ${
                  activeTag === tag
                    ? "bg-[var(--green)] border-[var(--green)] text-[var(--bg-primary)]"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--green)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </FadeIn>

        {filtered.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24">
              <BookOpen size={40} className="text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-muted)] font-mono text-sm">No posts yet. Check back soon.</p>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" staggerDelay={0.07}>
            {filtered.map((post) => (
              <StaggerItem key={post.id}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card group h-full flex flex-col overflow-hidden">
      {/* Cover */}
      <div className="relative h-44 bg-[var(--bg-elevated)] overflow-hidden">
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-[var(--green)] opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60" />
        {post.tags[0] && (
          <div className="absolute top-3 left-3">
            <span className="tag text-[10px] py-0.5">{post.tags[0]}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-[var(--green)] transition-colors">
          {post.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm font-body leading-relaxed mb-4 flex-1">{post.summary}</p>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <Calendar size={9} /> {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock size={9} /> {post.readingTime}
              </span>
            )}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 font-mono text-xs text-[var(--green)] hover:text-[var(--green-bright)] transition-colors"
          >
            Read <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
