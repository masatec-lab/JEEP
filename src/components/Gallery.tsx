"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

interface GalleryItemData {
  id: string;
  image: string;
  alt: string;
  span: string;
}

const gradients = [
  "from-[#1a3a2a] via-[#0d1f2d] to-[#1a1a1a]",
  "from-[#2a1a1a] via-[#1f1a0d] to-[#1a1a1a]",
  "from-[#1a1a2a] via-[#0d2a1f] to-[#1a1a1a]",
  "from-[#1a2a2a] via-[#1a0d2a] to-[#1a1a1a]",
  "from-[#2a2a1a] via-[#0d1f2a] to-[#1a1a1a]",
  "from-[#1a2a1a] via-[#2a1a0d] to-[#1a1a1a]",
  "from-[#0d2a2a] via-[#1a1a2a] to-[#1a1a1a]",
  "from-[#2a1a2a] via-[#1a2a0d] to-[#1a1a1a]",
];

export default function Gallery({ items: galleryItems }: { items: GalleryItemData[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? galleryItems.length - 1 : lightboxIndex - 1
    );
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === galleryItems.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  return (
    <section className="py-20 sm:py-28 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Галерея"
          subtitle="Фотографии с наших маршрутов — скоро здесь будут реальные кадры"
        />

        {/* Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] sm:auto-rows-[220px]">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-xl ${item.span} cursor-pointer`}
            >
              {/* Gradient placeholder */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors z-10 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>

              {/* Alt text label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent z-10">
                <span className="text-xs text-white/80">{item.alt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 sm:left-8 text-white/70 hover:text-white transition-colors z-50"
            aria-label="Предыдущее"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Image area */}
          <div
            className="relative w-full max-w-4xl mx-16 aspect-video rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradients[lightboxIndex % gradients.length]}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-text-secondary text-lg">
                {galleryItems[lightboxIndex].alt}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 sm:right-8 text-white/70 hover:text-white transition-colors z-50"
            aria-label="Следующее"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/50">
            {lightboxIndex + 1} / {galleryItems.length}
          </div>
        </div>
      )}
    </section>
  );
}
