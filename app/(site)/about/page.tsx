import { prisma } from "@/lib/db";
import AboutSection from "@/components/sections/About/AboutSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const about = await prisma.about.findFirst();

  const defaultAbout = {
    fullName: "Bonya Ransom Nkeh Kongnyuy",
    title: "Software Engineer & AI Enthusiast",
    profileImage: null,
    bio: "I'm Ransom — a software engineer passionate about building intelligent, impactful systems.\n\nMy work sits at the intersection of elegant engineering and real-world problem-solving.\n\nI believe technology should empower people — and I build with that conviction at the core.",
    skills: ["Python", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Machine Learning"],
    interests: ["AI", "Computer Vision", "Open Source", "Healthcare Tech"],
    mission: "To build technology that solves real problems — elegantly, reliably, and at scale.",
    status: "Open to Opportunities",
    location: "Cameroon 🇨🇲",
    languages: ["English", "French"],
    funFacts: ["I debug by talking to rubber ducks 🦆", "Dark mode is a human right", "More docs than most people read"],
    resumeUrl: "/resume.pdf",
  };

  return <AboutSection data={about ?? defaultAbout} />;
}
