import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessengerWidgetWrapper from "@/components/MessengerWidgetWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeProvider from "@/components/ThemeProvider";
import { getContacts } from "@/lib/data";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jeepping Travel Адыгея — Джиппинг-туры по горам Адыгеи",
    template: "%s | Jeepping Travel Адыгея",
  },
  description:
    "Джиппинг в Адыгее на УАЗах. 10 маршрутов по горам, водопадам и ущельям. Безопасно для семей с детьми. Бронируйте онлайн от 5 000 ₽.",
  keywords: [
    "джиппинг адыгея",
    "джиппинг краснодарский край",
    "джип туры адыгея",
    "off-road адыгея",
    "экскурсии адыгея",
    "лаго-наки джиппинг",
    "хаджох джиппинг",
    "каменномостский джиппинг",
    "отдых адыгея",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Jeepping Travel Адыгея",
    title: "Jeepping Travel Адыгея — Джиппинг-туры по горам Адыгеи",
    description:
      "10 маршрутов по горам, водопадам и ущельям Адыгеи на УАЗах. Безопасно для семей с детьми.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contacts = await getContacts();

  return (
    <html lang="ru" className={`${montserrat.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){var p=window.location.pathname;document.documentElement.classList.add(p.startsWith('/admin')?'light-admin':'light')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header contacts={contacts} />
          {children}
          <Footer contacts={contacts} />
          <ScrollToTop />
          <MessengerWidgetWrapper contacts={contacts} />
        </ThemeProvider>
      </body>
    </html>
  );
}
