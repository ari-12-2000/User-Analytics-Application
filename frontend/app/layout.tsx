import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DashboardNav from "@/components/DashboardNav";
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
  title: "User Analytics Dashboard",
  description: "Session tracking and click heatmaps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-100 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                CausalFunnel
              </p>
              <h1 className="text-lg font-semibold tracking-tight">
                User Analytics
              </h1>
            </div>
            <DashboardNav />
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
