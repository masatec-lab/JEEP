import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Админ-панель | Jeepping Travel",
    template: "%s | Админ-панель",
  },
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
