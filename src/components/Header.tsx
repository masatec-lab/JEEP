"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/routes", label: "Маршруты" },
  { href: "/about", label: "О нас" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header({ contacts }: { contacts: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-bg-primary font-bold text-lg transition-transform group-hover:scale-105">
              JT
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-text-primary">
                Jeepping Travel
              </span>
              <span className="block text-xs text-text-muted tracking-widest uppercase">
                Адыгея
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${contacts.phone_raw || "+79991234567"}`}
              className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              {contacts.phone || "+7 (999) 123-45-67"}
            </a>
            <ThemeToggle />
            <Link
              href="/contacts#booking"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
            >
              Забронировать
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Меню"
          >
            <span
              className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[32rem] border-b border-border" : "max-h-0"
        }`}
      >
        <div className="bg-bg-primary/95 backdrop-blur-md px-4 pb-6 pt-2">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-accent transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${contacts.phone_raw || "+79991234567"}`}
              className="text-base font-semibold text-accent py-2"
            >
              {contacts.phone || "+7 (999) 123-45-67"}
            </a>
            <div className="flex items-center gap-3 py-2">
              <ThemeToggle />
              <span className="text-sm text-text-muted">Сменить тему</span>
            </div>
            <Link
              href="/contacts#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
            >
              Забронировать
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
