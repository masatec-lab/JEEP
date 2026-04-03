"use client";

import { useState } from "react";
import Image from "next/image";

interface RoutePhoto {
  id: string;
  image: string;
  alt: string;
}

interface StartPoint {
  name: string;
  extraPrice: number;
}

export function PriceCalc({
  basePrice,
  extraHourPrice,
  maxExtraHours,
  duration,
  startPoints,
}: {
  basePrice: number;
  extraHourPrice: number;
  maxExtraHours: number;
  duration: string;
  startPoints: StartPoint[];
}) {
  const [selectedStart, setSelectedStart] = useState(0);
  const [extraHours, setExtraHours] = useState(0);

  const startExtra = startPoints[selectedStart]?.extraPrice || 0;
  const total = basePrice + startExtra + extraHourPrice * extraHours;
  const hasOptions = startPoints.length > 1 || (extraHourPrice > 0 && maxExtraHours > 0);

  if (!hasOptions && startPoints.length <= 1) return null;

  return (
    <div className="border-t border-border pt-6 space-y-4">
      {/* Start point selection */}
      {startPoints.length > 1 && (
        <div>
          <div className="text-sm font-medium text-text-primary mb-2">Точка старта</div>
          <div className="space-y-2">
            {startPoints.map((sp, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setSelectedStart(i)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors text-left ${
                  selectedStart === i
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedStart === i ? "border-accent" : "border-text-muted"
                    }`}
                  >
                    {selectedStart === i && (
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <span className="text-sm text-text-primary">{sp.name}</span>
                </div>
                <span className={`text-xs font-medium ${
                  sp.extraPrice === 0 ? "text-green" : "text-accent"
                }`}>
                  {sp.extraPrice === 0 ? "базовая" : `+${sp.extraPrice.toLocaleString("ru-RU")} ₽`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Extra hours */}
      {extraHourPrice > 0 && maxExtraHours > 0 && (
        <div>
          <div className="text-sm font-medium text-text-primary mb-2">Продлить поездку</div>
          <p className="text-xs text-text-muted mb-3">
            +{extraHourPrice.toLocaleString("ru-RU")} ₽ за каждый доп. час
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setExtraHours(Math.max(0, extraHours - 1))}
              disabled={extraHours === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>

            <div className="flex-1 text-center">
              <div className="text-sm font-bold text-text-primary">
                {extraHours === 0 ? duration : `${duration} + ${extraHours} ч.`}
              </div>
            </div>

            <button
              onClick={() => setExtraHours(Math.min(maxExtraHours, extraHours + 1))}
              disabled={extraHours >= maxExtraHours}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      {(startExtra > 0 || extraHours > 0) && (
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Базовый маршрут</span>
              <span>{basePrice.toLocaleString("ru-RU")} ₽</span>
            </div>
            {startExtra > 0 && (
              <div className="flex justify-between text-xs text-text-muted">
                <span>{startPoints[selectedStart].name}</span>
                <span>+{startExtra.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            {extraHours > 0 && (
              <div className="flex justify-between text-xs text-text-muted">
                <span>+{extraHours} доп. час{extraHours > 1 ? "а" : ""}</span>
                <span>+{(extraHourPrice * extraHours).toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-accent/20">
              <span className="text-sm font-medium text-text-primary">Итого:</span>
              <span className="text-xl font-bold text-accent">
                {total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RoutePhotoGallery({ photos }: { photos: RoutePhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary">Фотографии</h2>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
          >
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="flex items-center justify-between px-6 py-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-white/50">
              {lightboxIndex + 1} / {photos.length}
            </p>
            <button onClick={() => setLightboxIndex(null)} className="text-white/50 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxIndex(lightboxIndex === 0 ? photos.length - 1 : lightboxIndex - 1)}
              className="absolute left-4 sm:left-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="relative w-full max-w-5xl aspect-video mx-16">
              <Image
                src={photos[lightboxIndex].image}
                alt={photos[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button
              onClick={() => setLightboxIndex(lightboxIndex === photos.length - 1 ? 0 : lightboxIndex + 1)}
              className="absolute right-4 sm:right-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {photos[lightboxIndex].alt && (
            <div className="text-center py-2">
              <p className="text-sm text-white/50">{photos[lightboxIndex].alt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
