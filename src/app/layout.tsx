import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journal TDAH",
  description:
    "Journal de bord interactif et bienveillant — compagnon du guide Apprivoiser son TDAH.",
  icons: { icon: "/favicon.ico" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1B4FE5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-tab="matin" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
