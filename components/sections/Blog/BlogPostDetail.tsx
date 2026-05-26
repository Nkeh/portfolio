import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Clock, Eye, Tag } from "lucide-react";
import { FadeIn } from "@/components/ui/Motion";
import { formatDate } from "@/lib/utils";

interface BlogPostDetailProps {
  post: {
    title: string;
    content: string;
    summary: string;
    coverImage?: string | null;
    author: string;
    publishedAt: string;
    tags: string[];
    readingTime?: string | null;
    views: number;
  };
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  return (
    <article className="min-h-screen pt-[calc(var(--navbar-h)+2rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="section-container relative z-10 max-w-3xl mx-auto">
        <FadeIn>
          <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--green)] font-mono text-xs transition-colors mb-8">
            <ArrowLeft size={13} /> Back to Blog
          </Link>
        </FadeIn>

        {/* Cover image */}
        {post.coverImage && (
          <FadeIn delay={0.05} className="mb-10">
            <div className="relative aspect-video rounded-sm overflow-hidden border border-[var(--border-subtle)]">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.1}>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 tag text-xs">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 leading-tight">{post.title}</h1>
          <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed mb-6">{post.summary}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--green)] flex items-center justify-center text-[var(--bg-primary)] text-[9px] font-bold">
                {post.author[0]}
              </span>
              {post.author}
            </span>
            <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(post.publishedAt)}</span>
            {post.readingTime && <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime}</span>}
            <span className="flex items-center gap-1"><Eye size={11} /> {post.views} views</span>
          </div>
        </FadeIn>

        {/* Content */}
        <FadeIn delay={0.2}>
          <div className="prose-dark mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </FadeIn>
      </div>
    </article>
  );
}
