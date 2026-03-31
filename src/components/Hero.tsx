"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero({ contacts }: { contacts: Record<string, string> }) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      >
        {/* Gradient placeholder — заменить на реальное фото/видео */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#0A0A0A]" />

        {/* Decorative mountain silhouette */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full text-bg-primary opacity-60"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,400 L0,280 Q120,180 240,220 Q360,260 480,200 Q560,160 640,180 Q720,200 800,160 Q880,120 960,150 Q1040,180 1120,140 Q1200,100 1280,160 Q1360,220 1440,180 L1440,400 Z" />
        </svg>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-1 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-8">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-accent">
            Сезон открыт — бронируйте место
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          <span className="block text-text-primary">Джиппинг</span>
          <span className="block text-text-primary">по горам</span>
          <span className="block text-accent mt-2">Адыгеи</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          10&nbsp;маршрутов на УАЗах через водопады, ущелья и&nbsp;горные хребты.
          Безопасно для&nbsp;семей с&nbsp;детьми. От&nbsp;5&nbsp;000&nbsp;&#8381;
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/routes"
            className="w-full sm:w-auto rounded-full bg-accent px-8 py-4 text-base font-semibold text-bg-primary hover:bg-accent-hover transition-all hover:scale-105 shadow-lg shadow-accent/20"
          >
            Выбрать маршрут
          </Link>
          <a
            href={`tel:${contacts.phone_raw || "+79991234567"}`}
            className="w-full sm:w-auto rounded-full border border-text-primary/20 px-8 py-4 text-base font-semibold text-text-primary hover:border-accent hover:text-accent transition-all"
          >
            Позвонить нам
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-accent">10</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">маршрутов</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-accent">25+</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">водителей</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-accent">1000+</div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">довольных гостей</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs text-text-muted tracking-widest uppercase">
          Листайте
        </span>
        <div className="h-10 w-6 rounded-full border-2 border-text-muted/40 flex items-start justify-center p-1.5">
          <div className="h-2 w-1 rounded-full bg-accent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
