import SectionHeading from "./SectionHeading";

const vehicles = [
  {
    name: "УАЗ Хантер",
    seats: 6,
    description:
      "Компактный и манёвренный внедорожник. Идеален для узких горных троп и сложного бездорожья. Проедет там, где другие даже не рискнут.",
    features: [
      "6 посадочных мест",
      "Полный привод",
      "Высокий клиренс",
      "Усиленная подвеска",
      "Лебёдка",
      "Тент от дождя",
    ],
    image: "/images/fleet/hunter.jpg",
  },
  {
    name: "УАЗ Патриот",
    seats: 8,
    description:
      "Просторный внедорожник для больших компаний и семей. Больше комфорта, но не меньше проходимости. Отлично подходит для длительных маршрутов.",
    features: [
      "8 посадочных мест",
      "Полный привод",
      "Повышенный комфорт",
      "Усиленная подвеска",
      "Лебёдка",
      "Кондиционер",
    ],
    image: "/images/fleet/patriot.jpg",
  },
];

export default function Fleet() {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Наш автопарк"
          subtitle="Проверенные внедорожники, которые пройдут везде"
        />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-bg-primary overflow-hidden transition-all hover:border-accent/30"
            >
              {/* Image placeholder */}
              <div className="relative h-64 overflow-hidden bg-bg-tertiary">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#1a1a2a] to-[#0A0A0A]" />

                {/* Vehicle name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-primary/90 to-transparent">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {vehicle.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      {vehicle.seats} мест
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Features grid */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {vehicle.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-10 text-center text-sm text-text-muted">
          Все машины проходят регулярное техническое обслуживание и проверку перед каждым выездом
        </p>
      </div>
    </section>
  );
}
