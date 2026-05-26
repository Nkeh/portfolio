import { prisma } from "@/lib/db";
import ReviewsSection from "@/components/sections/Reviews/ReviewsSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { date: "desc" }],
  });
  return <ReviewsSection reviews={reviews} />;
}
