"use client";

import { usePathname } from "next/navigation";
import MessengerWidget from "./MessengerWidget";

export default function MessengerWidgetWrapper({
  contacts,
}: {
  contacts: Record<string, string>;
}) {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return <MessengerWidget contacts={contacts} />;
}
