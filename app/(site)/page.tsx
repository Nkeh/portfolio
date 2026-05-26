import { prisma } from "@/lib/db";
import HomePage from "@/components/sections/Home/HomePage";

export default async function Page() {
  const [about, education, experience, skills, projects, posts, reviews] = await Promise.all([
    prisma.about.findFirst(),
    prisma.education.findMany({ orderBy: { order: "asc" }, take: 3 }),
    prisma.experience.findMany({ orderBy: { order: "asc" }, take: 3 }),
    prisma.skill.findMany({ orderBy: { category: "asc" } }),
    prisma.project.findMany({
      include: { skills: true },
      orderBy: [{ featured: "desc" }, { date: "desc" }],
      take: 6,
    }),
    prisma.blog.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
      select: { id: true, title: true, slug: true, summary: true, coverImage: true, publishedAt: true, tags: true, readingTime: true, views: true },
    }),
    prisma.review.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }], take: 6 }),
  ]);

  const defaultAbout = {
    fullName: "Bonya Ransom Nkeh Kongnyuy", title: "Software Engineer & AI Enthusiast",
    profileImage: null,
    bio: "I'm Ransom — a software engineer passionate about building intelligent, impactful systems.\n\nMy work sits at the intersection of elegant engineering and real-world problem-solving.\n\nI believe technology should empower people — and I build with that conviction at the core.",
    skills: ["Python","TypeScript","React","Next.js","Node.js","PostgreSQL","Machine Learning"],
    interests: ["AI","Computer Vision","Open Source","Healthcare Tech"],
    mission: "To build technology that solves real problems — elegantly, reliably, and at scale.",
    status: "Open to Opportunities", location: "Cameroon 🇨🇲",
    languages: ["English","French"],
    funFacts: ["I debug by talking to rubber ducks 🦆","Dark mode is a human right","More docs than most people read"],
    resumeUrl: "/resume.pdf",
  };

  return (
    <HomePage
      about={about || defaultAbout}
      education={education}
      experience={experience}
      skills={skills}
      projects={projects}
      posts={posts}
      reviews={reviews}
    />
  );
}
