import { prisma } from "@/lib/db";
import Link from "next/link";
import { FolderOpen, BookOpen, Star, MessageSquare, User, FileText, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const [projectCount, blogCount, reviewCount, messageCount, unreadCount] = await Promise.all([
    prisma.project.count(),
    prisma.blog.count(),
    prisma.review.count(),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
  ]);

  const recentMessages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Projects", value: projectCount, icon: FolderOpen, href: "/admin/dashboard/projects", color: "text-blue-400" },
    { label: "Blog Posts", value: blogCount, icon: BookOpen, href: "/admin/dashboard/blog", color: "text-purple-400" },
    { label: "Reviews", value: reviewCount, icon: Star, href: "/admin/dashboard/reviews", color: "text-yellow-400" },
    { label: "Messages", value: messageCount, icon: MessageSquare, href: "/admin/dashboard/messages", badge: unreadCount, color: "text-[var(--green)]" },
  ];

  const quickLinks = [
    { label: "Edit About", href: "/admin/dashboard/about", icon: User },
    { label: "Manage Resume", href: "/admin/dashboard/resume", icon: FileText },
    { label: "Add Project", href: "/admin/dashboard/projects", icon: FolderOpen },
    { label: "New Blog Post", href: "/admin/dashboard/blog", icon: BookOpen },
  ];

  return (
    <div className="pt-14 md:pt-0">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">
          Dashboard<span className="text-[var(--green)]">.</span>
        </h1>
        <p className="font-mono text-xs text-[var(--text-muted)]">Welcome back, Ransom.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-5 hover:border-[var(--border-strong)] transition-all">
            <div className="flex items-start justify-between mb-3">
              <stat.icon size={18} className={stat.color} />
              {stat.badge ? (
                <span className="font-mono text-[10px] bg-[var(--green)] text-[var(--bg-primary)] px-1.5 py-0.5 rounded-sm">
                  {stat.badge} new
                </span>
              ) : null}
            </div>
            <p className="font-display font-bold text-3xl text-[var(--text-primary)]">{stat.value}</p>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick links */}
        <div>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Quick Actions</p>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-4 card p-4 hover:border-[var(--border-strong)] group"
              >
                <div className="w-9 h-9 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm flex items-center justify-center group-hover:border-[var(--green)] group-hover:bg-[var(--green-dim)] transition-all">
                  <link.icon size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--green)] transition-colors" />
                </div>
                <span className="font-body text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors flex-1">
                  {link.label}
                </span>
                <ArrowRight size={13} className="text-[var(--text-muted)] group-hover:text-[var(--green)] transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Recent Messages</p>
            <Link href="/admin/dashboard/messages" className="font-mono text-xs text-[var(--green)] hover:text-[var(--green-bright)] transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentMessages.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="font-mono text-xs text-[var(--text-muted)]">No messages yet.</p>
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className={`card p-4 ${!msg.read ? "border-[rgba(0,200,83,0.2)]" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0" />}
                        <p className="font-display font-semibold text-sm text-[var(--text-primary)] truncate">{msg.name}</p>
                      </div>
                      <p className="font-body text-xs text-[var(--text-muted)] truncate mt-0.5">{msg.subject}</p>
                    </div>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
