import { prisma } from "@/lib/db";
import ProjectDetail from "@/components/sections/Projects/ProjectDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.shortDescription };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { skills: true },
  });
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
