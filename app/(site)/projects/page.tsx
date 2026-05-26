import { prisma } from "@/lib/db";
import ProjectsSection from "@/components/sections/Projects/ProjectsSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { skills: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { date: "desc" }],
  });
  return <ProjectsSection projects={projects} />;
}
