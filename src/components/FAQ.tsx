"use client";

import { useState } from "react";
import { faq } from "@/data/faq";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Частые вопросы"
          subtitle="Ответы на всё, что вы хотели узнать перед поездкой"
        />

        <div className="mt-16 mx-auto max-w-3xl divide-y divide-border">
          {faq.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span
                  className={`text-base sm:text-lg font-medium transition-colors ${
                    openIndex === index ? "text-accent" : "text-text-primary"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                    openIndex === index
                      ? "border-accent bg-accent text-bg-primary rotate-45"
                      : "border-border text-text-muted"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-60 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed pr-12">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
