"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import SectionHeading from "./SectionHeading";

interface Photo {
  id: string;
  image: string;
  alt: string;
}

interface Album {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  photos: Photo[];
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

export default function AlbumGallery({ albums }: { albums: Album[] }) {
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const zoomRef = useRef<ReactZoomPanPinchRef>(null);

  const openAlbum = (album: Album) => {
    if (album.photos.length === 0) return;
    setActiveAlbum(album);
    setCarouselIndex(0);
  };

  const closeAlbum = () => {
    setActiveAlbum(null);
    setCarouselIndex(0);
  };

  const resetZoom = useCallback(() => {
    zoomRef.current?.resetTransform();
  }, []);

  const goPrev = useCallback(() => {
    if (!activeAlbum) return;
    resetZoom();
    setCarouselIndex((i) =>
      i === 0 ? activeAlbum.photos.length - 1 : i - 1
    );
  }, [activeAlbum, resetZoom]);

  const goNext = useCallback(() => {
    if (!activeAlbum) return;
    resetZoom();
    setCarouselIndex((i) =>
      i === activeAlbum.photos.length - 1 ? 0 : i + 1
    );
  }, [activeAlbum, resetZoom]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeAlbum) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") closeAlbum();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeAlbum, goPrev, goNext]);

  return (
    <section className="py-20 sm:py-28 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Галерея"
          subtitle="Фотоальбомы с наших маршрутов — нажмите, чтобы посмотреть"
        />

        {/* Albums grid: 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album, index) => (
            <button
              key={album.id}
              onClick={() => openAlbum(album)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] text-left cursor-pointer"
            >
              {/* Cover image or gradient */}
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} transition-transform duration-700 group-hover:scale-110`}
                />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

              {/* Photo count badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  {album.photos.length}
                </span>
              </div>

              {/* Title & description */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                  {album.title}
                </h3>
                {album.description && (
                  <p className="mt-1 text-sm text-white/70 line-clamp-2">
                    {album.description}
                  </p>
                )}
              </div>

              {/* Hover icon */}
              <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Carousel overlay */}
      {activeAlbum && activeAlbum.photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
          onClick={closeAlbum}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-lg font-bold text-white">{activeAlbum.title}</h3>
              <p className="text-sm text-white/50">
                {carouselIndex + 1} / {activeAlbum.photos.length}
              </p>
            </div>
            <button
              onClick={closeAlbum}
              className="text-white/50 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-2 sm:px-4 relative" onClick={(e) => e.stopPropagation()}>
            {/* Prev button */}
            <button
              onClick={goPrev}
              className="absolute left-1 sm:left-8 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Предыдущее"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Image with pinch-to-zoom */}
            <div className="relative w-full max-w-5xl aspect-[3/4] sm:aspect-video mx-10 sm:mx-16">
              <TransformWrapper
                ref={zoomRef}
                initialScale={1}
                minScale={1}
                maxScale={5}
                doubleClick={{ mode: "toggle", step: 2 }}
                pinch={{ step: 30 }}
                wheel={{ step: 0.8, smoothStep: 0.01 }}
                panning={{ velocityDisabled: false }}
              >
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <Image
                    src={activeAlbum.photos[carouselIndex].image}
                    alt={activeAlbum.photos[carouselIndex].alt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                    draggable={false}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* Next button */}
            <button
              onClick={goNext}
              className="absolute right-1 sm:right-8 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Следующее"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Alt text */}
          {activeAlbum.photos[carouselIndex].alt && (
            <div className="text-center py-2">
              <p className="text-sm text-white/50">
                {activeAlbum.photos[carouselIndex].alt}
              </p>
            </div>
          )}

          {/* Thumbnails */}
          <div className="px-6 py-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center">
              {activeAlbum.photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setCarouselIndex(i)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                    i === carouselIndex
                      ? "ring-2 ring-accent opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image
                    src={photo.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
