import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const SOCIAL = [
  { icon: Github, href: "https://github.com/Nkeh", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/ransom", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/ransom", label: "Twitter" },
  { icon: Mail, href: "mailto:ransom@example.com", label: "Email" },
];
const NAV = [
  { label: "About", href: "/" }, { label: "Resume", href: "/resume" },
  { label: "Projects", href: "/projects" }, { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" }, { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,200,83,0.08)] bg-[var(--bg-secondary)]">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8"><Image src="/logo.png" alt="Ransom" fill className="object-contain"  /></div>
              <span className="font-display font-bold text-base text-[var(--text-primary)]">Ransom<span className="text-[var(--green)]">.</span></span>
            </Link>
            <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Building elegant, scalable software that makes a real difference.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Pages</p>
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((link) => (
                <Link key={link.href} href={link.href} className="font-body text-sm text-[var(--text-secondary)] hover:text-[var(--green)] transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Connect</p>
            <div className="flex gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-[rgba(0,200,83,0.12)] text-[var(--text-muted)] hover:text-[var(--green)] hover:border-[var(--green)] hover:bg-[var(--green-dim)] transition-all duration-200 rounded-sm">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} Bonya Ransom Nkeh Kongnyuy. All rights reserved.</p>
          <p className="font-mono text-xs text-[var(--text-muted)]">Built with <span className="text-[var(--green)]">Next.js</span> &amp; <span className="text-[var(--green)]">♥</span></p>
        </div>
      </div>
    </footer>
  );
}
