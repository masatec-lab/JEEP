import Link from "next/link";

const navLinks = [
  { href: "/routes", label: "Маршруты" },
  { href: "/about", label: "О нас" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

const routeLinks = [
  { href: "/routes/chertov-palec", label: 'Скала "Чёртов палец"' },
  { href: "/routes/sahrayskie-vodopady", label: "Сахрайские водопады" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-bg-primary font-bold text-lg">
                JT
              </div>
              <div>
                <span className="text-lg font-bold text-text-primary">
                  Jeepping Travel
                </span>
                <span className="block text-xs text-text-muted tracking-widest uppercase">
                  Адыгея
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Джиппинг-туры по горам Адыгеи на УАЗах. 10&nbsp;маршрутов для
              семей, компаний и любителей экстрима.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Навигация
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular routes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Популярные маршруты
            </h3>
            <ul className="mt-4 space-y-3">
              {routeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Контакты
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+79991234567"
                  className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  +7 (999) 123-45-67
                </a>
              </li>
              <li className="text-sm text-text-secondary">
                пос. Каменномостский, Адыгея
              </li>
            </ul>

            {/* Messengers */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://wa.me/79991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary hover:bg-green hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://t.me/jeepping_travel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary hover:bg-[#2AABEE] hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://max.ru/jeepping_travel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary hover:bg-[#FF6600] hover:text-white transition-colors"
                aria-label="Max"
              >
                <span className="text-sm font-bold">M</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Jeepping Travel Адыгея. Все права
            защищены.
          </p>
          <p className="text-xs text-text-muted">
            Республика Адыгея, пос. Каменномостский
          </p>
        </div>
      </div>
    </footer>
  );
}
