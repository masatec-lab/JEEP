"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface RoutePhoto {
  id: string;
  image: string;
  alt: string;
}

interface StartPoint {
  name: string;
  extraPrice: number;
}

interface Vehicle {
  name: string;
  seats: number;
  price: number;
}

export function PriceCalc({
  instanceId = "default",
  routeName,
  basePrice,
  pricePatriot,
  hunterEnabled,
  patriotEnabled,
  extraHourPrice,
  maxExtraHours,
  duration,
  startPoints,
}: {
  instanceId?: string;
  routeName: string;
  basePrice: number;
  pricePatriot: number;
  hunterEnabled: boolean;
  patriotEnabled: boolean;
  extraHourPrice: number;
  maxExtraHours: number;
  duration: string;
  startPoints: StartPoint[];
}) {
  const vehicles: Vehicle[] = [
    ...(hunterEnabled ? [{ name: "УАЗ Хантер", seats: 6, price: basePrice }] : []),
    ...(patriotEnabled && pricePatriot > 0 ? [{ name: "УАЗ Патриот", seats: 8, price: pricePatriot }] : []),
  ];

  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [selectedStart, setSelectedStart] = useState(0);
  const [extraHours, setExtraHours] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");

  const vehiclePrice = vehicles[selectedVehicle]?.price || basePrice;
  const startExtra = startPoints[selectedStart]?.extraPrice || 0;
  const total = vehiclePrice + startExtra + extraHourPrice * extraHours;

  return (
    <div className="border-t border-border pt-6 space-y-4">
      {/* Vehicle selection */}
      {vehicles.length > 1 && (
        <div>
          <div className="text-sm font-medium text-text-primary mb-2">Выберите машину</div>
          <div className="space-y-2">
            {vehicles.map((v, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setSelectedVehicle(i)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors text-left ${
                  selectedVehicle === i
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedVehicle === i ? "border-accent" : "border-text-muted"
                    }`}
                  >
                    {selectedVehicle === i && (
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm text-text-primary">{v.name}</span>
                    <span className="ml-2 text-xs text-text-muted">до {v.seats} чел.</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-accent">
                  {v.price.toLocaleString("ru-RU")} ₽
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start point selection */}
      {startPoints.length > 0 && (
        <div>
          <div className="text-sm font-medium text-text-primary mb-2">Точка старта</div>
          {startPoints.length === 1 ? (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 flex items-center justify-between">
              <span className="text-sm text-text-primary">{startPoints[0].name}</span>
              <span className="text-xs font-medium text-green">базовая</span>
            </div>
          ) : (
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
          )}
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

      {/* Date & time */}
      <div>
        <div className="text-sm font-medium text-text-primary mb-2">Дата и время</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="date"
              id={`booking-date-${instanceId}`}
              name={`booking-date-${instanceId}`}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <select
              id={`booking-time-${instanceId}`}
              name={`booking-time-${instanceId}`}
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors cursor-pointer"
            >
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>
        </div>
      </div>

      {/* Total */}
      {(vehicles.length > 1 || startPoints.length > 1 || startExtra > 0 || extraHours > 0) && (
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
              <span>{vehicles[selectedVehicle]?.name || "Маршрут"}</span>
              <span>{vehiclePrice.toLocaleString("ru-RU")} ₽</span>
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

      {/* Booking button with pre-filled data */}
      {selectedDate && (
        <a
          href={`/contacts?${new URLSearchParams({
            route: routeName,
            vehicle: vehicles[selectedVehicle]?.name || "",
            start: startPoints[selectedStart]?.name || "",
            date: selectedDate,
            time: selectedTime,
            total: total.toString(),
          }).toString()}#booking`}
          className="block w-full rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          Забронировать на {new Date(selectedDate + "T00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "short" })} в {selectedTime}
        </a>
      )}
    </div>
  );
}

export function RoutePhotoGallery({ photos }: { photos: RoutePhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const zoomRef = useRef<ReactZoomPanPinchRef>(null);

  const resetZoom = useCallback(() => {
    zoomRef.current?.resetTransform();
  }, []);

  const goPrev = useCallback(() => {
    resetZoom();
    setLightboxIndex((i) => (i === null ? null : i === 0 ? photos.length - 1 : i - 1));
  }, [photos.length, resetZoom]);

  const goNext = useCallback(() => {
    resetZoom();
    setLightboxIndex((i) => (i === null ? null : i === photos.length - 1 ? 0 : i + 1));
  }, [photos.length, resetZoom]);

  // Auto-play
  const [paused, setPaused] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (lightboxIndex === null || paused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }
    autoplayTimerRef.current = setInterval(() => {
      resetZoom();
      setLightboxIndex((i) => (i === null ? null : i === photos.length - 1 ? 0 : i + 1));
    }, 4000);
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [lightboxIndex, paused, photos.length, resetZoom]);

  const pauseAutoplay = useCallback(() => {
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  }, []);

  const goPrevManual = useCallback(() => { pauseAutoplay(); goPrev(); }, [pauseAutoplay, goPrev]);
  const goNextManual = useCallback(() => { pauseAutoplay(); goNext(); }, [pauseAutoplay, goNext]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrevManual();
      if (e.key === "ArrowRight") goNextManual();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goPrevManual, goNextManual]);

  // Swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swipeHandled = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      swipeHandled.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || swipeHandled.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goPrevManual();
      else goNextManual();
      swipeHandled.current = true;
    }
    touchStart.current = null;
  }, [goPrevManual, goNextManual]);

  const imageContainerRef = useRef<HTMLDivElement>(null);

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

          <div
            ref={imageContainerRef}
            className="flex-1 flex items-center justify-center px-2 sm:px-4 relative"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => goPrevManual()}
              className="absolute left-1 sm:left-8 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="relative w-full max-w-5xl aspect-[3/4] sm:aspect-video mx-10 sm:mx-16">
              <TransformWrapper
                ref={zoomRef}
                initialScale={1}
                minScale={1}
                maxScale={5}
                doubleClick={{ mode: "toggle", step: 2 }}
                pinch={{ step: 30 }}
                wheel={{ step: 0.8, smoothStep: 0.01 }}
                panning={{ disabled: true }}
                onTransformed={(_ref, state) => {
                  if (state.scale > 1) setPaused(true);
                  else setPaused(false);
                }}
              >
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <Image
                    src={photos[lightboxIndex].image}
                    alt={photos[lightboxIndex].alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 90vw, 70vw"
                    priority
                    draggable={false}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            <button
              onClick={() => goNextManual()}
              className="absolute right-1 sm:right-8 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
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
