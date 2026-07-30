import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AllanFlow",
    template: "",
  },
  description: "Plataforma colaborativa de gerenciamento de tarefas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  );
}
