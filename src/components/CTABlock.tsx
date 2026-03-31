import Link from "next/link";

export default function CTABlock() {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-bg-primary to-bg-primary p-10 sm:p-16 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-green/5 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              Готовы к приключению?
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
              Забронируйте джиппинг-тур прямо сейчас и&nbsp;откройте для&nbsp;себя
              дикую красоту гор Адыгеи
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contacts#booking"
                className="w-full sm:w-auto rounded-full bg-accent px-10 py-4 text-base font-semibold text-bg-primary hover:bg-accent-hover transition-all hover:scale-105 shadow-lg shadow-accent/20"
              >
                Оставить заявку
              </Link>
              <a
                href="https://wa.me/79991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-green px-10 py-4 text-base font-semibold text-green hover:bg-green hover:text-white transition-all"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Написать в WhatsApp
              </a>
            </div>

            <p className="mt-8 text-sm text-text-muted">
              Или позвоните:{" "}
              <a
                href="tel:+79991234567"
                className="font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                +7 (999) 123-45-67
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
