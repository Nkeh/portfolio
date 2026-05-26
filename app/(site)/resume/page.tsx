import { prisma } from "@/lib/db";
import ResumeSection from "@/components/sections/Resume/ResumeSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const [education, experience, skills, certifications, about] = await Promise.all([
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { category: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.about.findFirst({ select: { resumeUrl: true } }),
  ]);

  return (
    <ResumeSection
      data={{ education, experience, skills, certifications, resumeUrl: about?.resumeUrl }}
    />
  );
}
