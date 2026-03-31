import SectionHeading from "./SectionHeading";
import StaggerChildren, { StaggerItem } from "./animations/StaggerChildren";

const steps = [
  {
    number: "01",
    title: "Выберите маршрут",
    description:
      "Посмотрите наши 10 маршрутов, сравните по сложности, длительности и цене. Не можете определиться? Напишите нам — поможем выбрать идеальный вариант.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Забронируйте дату",
    description:
      "Оставьте заявку на сайте, напишите в WhatsApp или Telegram, или просто позвоните. Мы подтвердим бронирование и расскажем все детали.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Наслаждайтесь поездкой",
    description:
      "Приезжайте к точке старта, садитесь в УАЗ — и вперёд, в горы! Опытный водитель-инструктор проведёт вас по маршруту, покажет лучшие виды и сделает остановки для фото.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Как это работает"
          subtitle="Три простых шага до незабываемого приключения"
        />

        <StaggerChildren stagger={0.2} className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <StaggerItem key={index} className="relative flex flex-col items-center text-center">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-accent/40 to-accent/10" />
              )}

              {/* Icon circle */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/30 bg-bg-secondary text-accent">
                {step.icon}
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-bg-primary">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
