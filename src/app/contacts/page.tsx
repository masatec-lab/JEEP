import { getContacts, getRoutes } from "@/lib/data";
import ContactsClient from "@/components/ContactsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с Jeepping Travel Адыгея — телефон, WhatsApp, Telegram, Max. Форма бронирования.",
};

export default async function ContactsPage() {
  const [contacts, routes] = await Promise.all([
    getContacts(),
    getRoutes(),
  ]);

  return <ContactsClient contacts={contacts} routes={routes} />;
}
