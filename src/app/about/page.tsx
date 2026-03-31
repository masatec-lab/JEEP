import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Jeepping Travel Адыгея — команда из 25+ опытных водителей-инструкторов. Джиппинг-туры по горам Адыгеи на УАЗах для семей и компаний.",
};

const values = [
  {
    title: "Безопасность превыше всего",
    description:
      "Каждый водитель знает маршрут наизусть. Машины проходят ТО перед каждым выездом. Мы возим семьи с детьми — и относимся к этому серьёзно.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Любовь к горам",
    description:
      "Мы не просто возим людей — мы влюблены в эти места. Каждый маршрут продуман так, чтобы вы увидели самое красивое и почувствовали дух Кавказа.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    title: "Честные цены",
    description:
      "Никаких скрытых доплат. Цена за машину — значит за машину. Вы платите один раз и наслаждаетесь поездкой без сюрпризов.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Индивидуальный подход",
    description:
      "Хотите остановиться подольше у водопада? Или проехать чуть дальше, чем обычно? Наши водители гибки и всегда идут навстречу.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10", label: "маршрутов" },
  { value: "25+", label: "водителей" },
  { value: "1000+", label: "довольных гостей" },
  { value: "7", label: "дней в неделю" },
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-bg-secondary overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-green/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary">
              Мы — <span className="text-accent">Jeepping Travel</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed">
              Команда из 25+ опытных водителей-инструкторов, которые знают горы
              Адыгеи как свои пять пальцев. Мы показываем людям красоту Кавказа
              через самый захватывающий формат — джиппинг по бездорожью.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <div key={i} className="py-10 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20 sm:py-28 bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            {/* Image placeholder */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2a] via-[#0d1f2d] to-[#1a1a1a]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-text-muted text-sm">Фото команды</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
                Наша история
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
              <div className="mt-8 space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Всё началось с любви к горам и бездорожью. Мы — местные,
                  выросли среди этих гор и знаем каждую тропу, каждый брод,
                  каждый поворот.
                </p>
                <p>
                  Сегодня наша команда — это более 25 профессиональных
                  водителей-инструкторов и&nbsp;парк проверенных УАЗов. Мы
                  разработали 10 маршрутов разной сложности — от лёгких
                  семейных прогулок до экстремальных восхождений на горные хребты.
                </p>
                <p>
                  Наша база находится в&nbsp;посёлке Каменномостский и станице
                  Даховская — в самом сердце горной Адыгеи. Отсюда рукой подать
                  до Лаго-Наки, Гуамского ущелья, водопадов и скал.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Наши принципы"
            subtitle="То, чем мы руководствуемся каждый день"
          />

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {values.map((item, i) => (
              <div
                key={i}
                className="flex gap-5 rounded-2xl border border-border bg-bg-primary p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="py-20 sm:py-28 bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Наш автопарк"
            subtitle="Надёжные внедорожники для любых маршрутов"
          />

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Hunter */}
            <div className="rounded-2xl border border-border bg-bg-secondary p-8">
              <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#1a1a2a] to-[#0A0A0A]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-text-muted text-sm">Фото УАЗ Хантер</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-primary">УАЗ Хантер</h3>
              <p className="mt-2 text-sm text-text-secondary">
                6 посадочных мест. Компактный и манёвренный — идеален для узких
                горных троп и сложного бездорожья.
              </p>
            </div>

            {/* Patriot */}
            <div className="rounded-2xl border border-border bg-bg-secondary p-8">
              <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2a] via-[#0d2a1f] to-[#0A0A0A]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-text-muted text-sm">Фото УАЗ Патриот</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-primary">УАЗ Патриот</h3>
              <p className="mt-2 text-sm text-text-secondary">
                8 посадочных мест. Просторный и комфортный — отлично подходит
                для больших компаний и длительных маршрутов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-bg-secondary border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Поехали с нами?
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Выберите маршрут и забронируйте поездку — покажем вам настоящую Адыгею
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/routes"
              className="w-full sm:w-auto rounded-full bg-accent px-8 py-4 text-base font-semibold text-bg-primary hover:bg-accent-hover transition-all hover:scale-105 shadow-lg shadow-accent/20"
            >
              Смотреть маршруты
            </Link>
            <Link
              href="/contacts"
              className="w-full sm:w-auto rounded-full border border-text-primary/20 px-8 py-4 text-base font-semibold text-text-primary hover:border-accent hover:text-accent transition-all"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
