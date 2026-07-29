// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "ransom@email.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "ransom@email.com",
      password: hashedPassword,
    },
  });

  // About
  await prisma.about.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      fullName: "Bonya Ransom Nkeh Kongnyuy",
      title: "Software Engineer & AI/ML Developer",
      bio: "I'm Ransom — a passionate software engineer with a deep interest in building intelligent systems that solve real-world problems. I specialize in full-stack web development and machine learning, with a focus on creating seamless user experiences backed by robust architectures.\n\nMy journey in tech started with curiosity about how things work under the hood. That curiosity has since evolved into expertise across modern web technologies, cloud infrastructure, and artificial intelligence. I love turning complex problems into elegant, scalable solutions.\n\nWhen I'm not coding, I'm exploring new frameworks, writing technical content, or contributing to open-source projects. I believe great software is built at the intersection of engineering rigor and creative thinking.",
      profileImage: "/profile.jpg",
      skills: [
        "TypeScript",
        "Python",
        "Next.js",
        "React",
        "Node.js",
        "TensorFlow",
        "PostgreSQL",
        "Docker",
        "AWS",
        "Prisma",
      ],
      interests: [
        "Artificial Intelligence",
        "Open Source",
        "System Design",
        "Technical Writing",
        "Computer Vision",
      ],
      mission:
        "To engineer intelligent, human-centered solutions that bridge the gap between cutting-edge technology and everyday impact.",
      status: "Open to Work",
      location: "Cameroon",
      languages: ["English", "French"],
      funFacts: [
        "I debug best with lo-fi music playing",
        "I've built apps used by 1000+ users",
        "I once built an entire API in one night",
      ],
      resumeUrl: "/resume.pdf",
    },
  });

  // Skills
  const skillsData = [
    { name: "TypeScript", category: "Frontend", level: 90 },
    { name: "React", category: "Frontend", level: 92 },
    { name: "Next.js", category: "Frontend", level: 88 },
    { name: "Tailwind CSS", category: "Frontend", level: 95 },
    { name: "Node.js", category: "Backend", level: 85 },
    { name: "Python", category: "Backend", level: 88 },
    { name: "FastAPI", category: "Backend", level: 80 },
    { name: "PostgreSQL", category: "Database", level: 82 },
    { name: "MongoDB", category: "Database", level: 78 },
    { name: "Prisma", category: "Database", level: 85 },
    { name: "TensorFlow", category: "AI/ML", level: 75 },
    { name: "PyTorch", category: "AI/ML", level: 72 },
    { name: "OpenCV", category: "AI/ML", level: 70 },
    { name: "Docker", category: "DevOps", level: 78 },
    { name: "AWS", category: "DevOps", level: 70 },
    { name: "Git", category: "Tools", level: 95 },
    { name: "Django", category: "Backend", level: 84 },
    { name: "Django REST Framework", category: "Backend", level: 82 },
    { name: "Angular", category: "Frontend", level: 80 },
    { name: "AI/ML", category: "AI/ML", level: 86 },

    { name: "Communication", category: "Soft Skills", level: 92 },
    { name: "Teamwork", category: "Soft Skills", level: 90 },
    { name: "Problem Solving", category: "Soft Skills", level: 94 },
    { name: "Critical Thinking", category: "Soft Skills", level: 89 },
    { name: "Adaptability", category: "Soft Skills", level: 91 },
    { name: "Leadership", category: "Soft Skills", level: 87 },
    { name: "Time Management", category: "Soft Skills", level: 88 },
    { name: "Mentorship", category: "Soft Skills", level: 85 },
    { name: "Collaboration", category: "Soft Skills", level: 93 },
    { name: "Creativity", category: "Soft Skills", level: 86 },
    { name: "Attention to Detail", category: "Soft Skills", level: 90 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  // Education
  await prisma.education.createMany({
    skipDuplicates: true,
    data: [
      {
        institution: "University of Bamenda",
        degree: "Bachelor of Engineering",
        field: "Computer Engineering",
        startDate: new Date("2022-10-01"),
        endDate: new Date("2026-12-20"),
        description:
          "Focused on software systems, algorithms, and embedded systems. Graduated with honors.",
        order: 0,
      },
    ],
  });

  // Experience
  await prisma.experience.createMany({
    skipDuplicates: true,
    data: [
      {
        company: "Freelance",
        role: "Full Stack Developer",
        startDate: new Date("2022-01-01"),
        current: true,
        responsibilities: [
          "Designed and built full-stack web applications for clients across multiple industries",
          "Architected REST and GraphQL APIs serving mobile and web clients",
          "Integrated AI/ML models into production web applications",
        ],
        achievements: [
          "Delivered 10+ projects on time and under budget",
          "Achieved 100% client satisfaction rating",
        ],
        location: "Remote",
        type: "Remote",
        order: 0,
      },
    ],
  });

  // Projects
  const reactSkill = await prisma.skill.findUnique({ where: { name: "React" } });
  const nextSkill = await prisma.skill.findUnique({ where: { name: "Next.js" } });
  const tsSkill = await prisma.skill.findUnique({ where: { name: "TypeScript" } });
  const pythonSkill = await prisma.skill.findUnique({ where: { name: "Python" } });

  await prisma.project.upsert({
    where: { slug: "ai-vision-dashboard" },
    update: {},
    create: {
      title: "AI Vision Dashboard",
      slug: "ai-vision-dashboard",
      shortDescription: "Real-time computer vision analytics platform",
      fullDescription:
        "A full-stack platform that integrates computer vision models with a modern React dashboard. Users can upload images or stream video for real-time object detection, classification, and analytics. Built with Next.js on the frontend and FastAPI + Python on the backend, powered by YOLO and OpenCV.",
      techStack: ["Next.js", "TypeScript", "Python", "FastAPI", "OpenCV", "PostgreSQL", "Docker"],
      projectType: "AI/ML",
      images: ["/projects/ai-dashboard-1.jpg"],
      githubUrl: "https://github.com/Nkeh",
      date: new Date("2024-03-01"),
      status: "Completed",
      keyFeatures: [
        "Real-time object detection via WebSocket stream",
        "Image upload with batch processing",
        "Analytics dashboard with charts",
        "Model confidence scoring",
      ],
      challenges: "Achieving low latency in real-time video processing while maintaining high accuracy was the core challenge.",
      solutions: "Implemented frame-skipping and model quantization to reduce inference time by 60% without significant accuracy loss.",
      role: "Solo Developer",
      tags: ["Computer Vision", "AI", "Dashboard"],
      featured: true,
      skills: {
        connect: [
          reactSkill && { id: reactSkill.id },
          nextSkill && { id: nextSkill.id },
          tsSkill && { id: tsSkill.id },
          pythonSkill && { id: pythonSkill.id },
        ].filter(Boolean) as { id: string }[],
      },
    },
  });

  // Blog
  await prisma.blog.upsert({
    where: { slug: "building-production-nextjs-apps" },
    update: {},
    create: {
      title: "Building Production-Ready Next.js Applications",
      slug: "building-production-nextjs-apps",
      content:
        "# Building Production-Ready Next.js Applications\n\nNext.js has become the de facto standard for building React applications at scale. In this post, I'll walk through patterns and practices that I've found essential for building robust production apps...\n\n## Project Structure\n\nA good project structure is the foundation of maintainability...",
      summary:
        "A deep dive into patterns, architecture decisions, and best practices I've learned building Next.js apps that scale.",
      coverImage: "/blog/nextjs-cover.jpg",
      author: "Ransom",
      publishedAt: new Date("2024-06-15"),
      published: true,
      tags: ["Next.js", "React", "Architecture", "TypeScript"],
      readingTime: "8 min read",
    },
  });

  // Reviews
  await prisma.review.createMany({
    skipDuplicates: true,
    data: [
      {
        reviewerName: "Sarah Mitchell",
        reviewerRole: "CTO",
        organization: "TechStartup Inc.",
        content:
          "Ransom delivered exceptional work on our platform. His ability to understand business requirements and translate them into elegant technical solutions is remarkable. The codebase he produced is clean, well-documented, and scalable.",
        rating: 5,
        featured: true,
        order: 0,
      },
      {
        reviewerName: "James Okonkwo",
        reviewerRole: "Lead Engineer",
        organization: "DataSphere",
        content:
          "Working with Ransom was a fantastic experience. He's not just a skilled developer — he's a problem solver who brings creative approaches to complex challenges. His AI integration work saved us weeks of development time.",
        rating: 5,
        featured: true,
        order: 1,
      },
    ],
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
