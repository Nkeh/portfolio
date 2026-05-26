"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mail, Phone, MapPin, Github, Linkedin, Twitter,
  Send, Loader2, CheckCircle
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});
type FormData = z.infer<typeof schema>;

const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "https://github.com/ransom", handle: "@ransom" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/ransom", handle: "Ransom N." },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/ransom", handle: "@ransom" },
];

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "ransom@example.com", href: "mailto:ransom@example.com" },
  { icon: MapPin, label: "Location", value: "Cameroon 🇨🇲", href: null },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
      reset();
      toast.success("Message sent! I'll get back to you soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="min-h-screen pt-[calc(var(--navbar-h)+4rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--green)] blur-[150px] pointer-events-none"
      />

      <div className="section-container relative z-10">
        <FadeIn>
          <div className="section-tag mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
            Let's Talk
          </div>
          <h2 className="text-5xl font-display font-bold mb-4">
            Contact<span className="text-[var(--green)]">.</span>
          </h2>
          <p className="text-[var(--text-secondary)] font-body mb-12 max-w-lg">
            Have a project in mind, or just want to say hi? My inbox is always open.
            I'll try to get back to you within 24 hours.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">
                  Get in Touch
                </p>
                <StaggerContainer className="space-y-3" staggerDelay={0.08}>
                  {CONTACT_INFO.map((info) => (
                    <StaggerItem key={info.label}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-[var(--border-default)] bg-[var(--bg-card)] flex items-center justify-center rounded-sm shrink-0">
                          <info.icon size={15} className="text-[var(--green)]" />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a href={info.href} className="font-body text-sm text-[var(--text-primary)] hover:text-[var(--green)] transition-colors">
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-body text-sm text-[var(--text-primary)]">{info.value}</p>
                          )}
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              <div>
                <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">
                  Find Me On
                </p>
                <StaggerContainer className="space-y-3" staggerDelay={0.08}>
                  {SOCIAL_LINKS.map((social) => (
                    <StaggerItem key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 border border-[var(--border-default)] bg-[var(--bg-card)] flex items-center justify-center rounded-sm shrink-0 group-hover:border-[var(--green)] group-hover:bg-[var(--green-dim)] transition-all duration-200">
                          <social.icon size={15} className="text-[var(--text-secondary)] group-hover:text-[var(--green)] transition-colors" />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                            {social.label}
                          </p>
                          <p className="font-body text-sm text-[var(--text-primary)] group-hover:text-[var(--green)] transition-colors">
                            {social.handle}
                          </p>
                        </div>
                      </a>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              {/* Availability badge */}
              <FadeIn delay={0.4}>
                <div className="card p-5 border-[var(--green)] bg-[var(--green-dim)]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
                    <div>
                      <p className="font-display font-semibold text-[var(--green)] text-sm">
                        Available for Work
                      </p>
                      <p className="font-mono text-xs text-[var(--text-secondary)]">
                        Open to freelance & full-time roles
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn delay={0.2} className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-[var(--green-dim)] border border-[var(--green)] flex items-center justify-center mb-6"
                >
                  <CheckCircle size={28} className="text-[var(--green)]" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-[var(--text-secondary)] font-body mb-6">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-outline text-sm">
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      placeholder="John Doe"
                      className="input"
                    />
                    {errors.name && (
                      <p className="font-mono text-xs text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className="input"
                    />
                    {errors.email && (
                      <p className="font-mono text-xs text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    placeholder="Project collaboration..."
                    className="input"
                  />
                  {errors.subject && (
                    <p className="font-mono text-xs text-red-400 mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell me about your project or idea..."
                    rows={6}
                    className="input resize-none"
                  />
                  {errors.message && (
                    <p className="font-mono text-xs text-red-400 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center py-3.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
