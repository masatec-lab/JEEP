"use client";

import { useState } from "react";
import { reviews } from "@/data/reviews";
import SectionHeading from "./SectionHeading";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < rating ? "text-accent" : "text-bg-tertiary"}`}
          fill="currentColor"
        >
          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);

  const goTo = (index: number) => setActive(index);
  const goPrev = () => setActive(active === 0 ? reviews.length - 1 : active - 1);
  const goNext = () => setActive(active === reviews.length - 1 ? 0 : active + 1);

  return (
    <section className="py-20 sm:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Отзывы гостей"
          subtitle="Что говорят те, кто уже побывал на наших маршрутах"
        />

        {/* Review card */}
        <div className="relative mt-16 mx-auto max-w-3xl">
          {/* Quote icon */}
          <div className="absolute -top-6 left-0 text-accent/10">
            <svg viewBox="0 0 24 24" className="h-20 w-20" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
            </svg>
          </div>

          <div className="rounded-2xl border border-border bg-bg-primary p-8 sm:p-12">
            {/* Stars */}
            <StarRating rating={reviews[active].rating} />

            {/* Text */}
            <blockquote className="mt-6 text-lg sm:text-xl text-text-primary leading-relaxed">
              &ldquo;{reviews[active].text}&rdquo;
            </blockquote>

            {/* Author & route */}
            <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-lg">
                  {reviews[active].name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-text-primary">
                    {reviews[active].name}
                  </div>
                  <div className="text-sm text-text-muted">
                    {reviews[active].date}
                  </div>
                </div>
              </div>

              <span className="rounded-full bg-bg-secondary px-4 py-1.5 text-xs font-medium text-text-secondary border border-border">
                {reviews[active].route}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {/* Prev */}
            <button
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
              aria-label="Предыдущий отзыв"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === active
                      ? "w-8 bg-accent"
                      : "w-2.5 bg-bg-tertiary hover:bg-text-muted"
                  }`}
                  aria-label={`Отзыв ${index + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
              aria-label="Следующий отзыв"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
