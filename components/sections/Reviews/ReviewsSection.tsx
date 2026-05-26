"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  organization: string;
  content: string;
  rating?: number | null;
  image?: string | null;
  date: string;
  featured: boolean;
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [featured, ...rest] = reviews;
  const [activeIndex, setActiveIndex] = useState(0);
  const allReviews = reviews;

  return (
    <section className="min-h-screen pt-[calc(var(--navbar-h)+4rem)] pb-20 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--green)] blur-[120px] pointer-events-none"
      />

      <div className="section-container relative z-10">
        <FadeIn>
          <div className="section-tag mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
            What People Say
          </div>
          <h2 className="text-5xl font-display font-bold mb-4">
            Reviews<span className="text-[var(--green)]">.</span>
          </h2>
          <p className="text-[var(--text-secondary)] font-body mb-12 max-w-lg">
            Feedback from clients, collaborators, and colleagues I've had the pleasure to work with.
          </p>
        </FadeIn>

        {reviews.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24">
              <MessageSquare size={40} className="text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-muted)] font-mono text-sm">No reviews yet.</p>
            </div>
          </FadeIn>
        ) : (
          <>
            {/* Featured carousel */}
            <FadeIn delay={0.1} className="mb-16">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="card p-8 md:p-12 relative overflow-hidden"
                  >
                    {/* Big quote mark */}
                    <Quote
                      size={80}
                      className="absolute top-6 right-6 text-[var(--green)] opacity-5"
                      strokeWidth={1}
                    />

                    {/* Stars */}
                    {allReviews[activeIndex]?.rating && (
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < (allReviews[activeIndex].rating ?? 0)
                                ? "text-[var(--green)] fill-[var(--green)]"
                                : "text-[var(--border-default)]"
                            }
                          />
                        ))}
                      </div>
                    )}

                    <p className="font-body text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed mb-8 max-w-3xl">
                      &ldquo;{allReviews[activeIndex]?.content}&rdquo;
                    </p>

                    <div className="flex items-center gap-4">
                      {allReviews[activeIndex]?.image ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--green)]">
                          <Image
                            src={allReviews[activeIndex].image!}
                            alt={allReviews[activeIndex].reviewerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--green-dim)] border border-[var(--border-default)] flex items-center justify-center">
                          <span className="font-display font-bold text-[var(--green)]">
                            {allReviews[activeIndex]?.reviewerName[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-display font-semibold text-[var(--text-primary)]">
                          {allReviews[activeIndex]?.reviewerName}
                        </p>
                        <p className="font-mono text-xs text-[var(--text-muted)]">
                          {allReviews[activeIndex]?.reviewerRole} ·{" "}
                          <span className="text-[var(--green)]">
                            {allReviews[activeIndex]?.organization}
                          </span>
                        </p>
                      </div>
                      <div className="ml-auto font-mono text-xs text-[var(--text-muted)]">
                        {formatDate(allReviews[activeIndex]?.date)}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                {allReviews.length > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => setActiveIndex((i) => (i - 1 + allReviews.length) % allReviews.length)}
                      className="btn-outline p-2"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex gap-2">
                      {allReviews.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`transition-all duration-200 rounded-full ${
                            i === activeIndex
                              ? "w-6 h-1.5 bg-[var(--green)]"
                              : "w-1.5 h-1.5 bg-[var(--border-default)] hover:bg-[var(--green)]"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveIndex((i) => (i + 1) % allReviews.length)}
                      className="btn-outline p-2"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Grid of all reviews */}
            {reviews.length > 1 && (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" staggerDelay={0.06}>
                {reviews.map((review, i) => (
                  <StaggerItem key={review.id}>
                    <motion.button
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveIndex(i)}
                      className={`card p-5 text-left w-full transition-all duration-200 ${
                        activeIndex === i ? "border-[var(--green)] bg-[var(--green-dim)]" : ""
                      }`}
                    >
                      {review.rating && (
                        <div className="flex gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              size={11}
                              className={
                                si < review.rating!
                                  ? "text-[var(--green)] fill-[var(--green)]"
                                  : "text-[var(--border-default)]"
                              }
                            />
                          ))}
                        </div>
                      )}
                      <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                        &ldquo;{review.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                          <span className="font-display font-bold text-xs text-[var(--green)]">
                            {review.reviewerName[0]}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-sm text-[var(--text-primary)] truncate">
                            {review.reviewerName}
                          </p>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                            {review.reviewerRole} · {review.organization}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}
      </div>
    </section>
  );
}
