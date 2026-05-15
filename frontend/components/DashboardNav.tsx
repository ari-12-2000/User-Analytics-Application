"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sessions", label: "Sessions" },
  { href: "/heatmap", label: "Heatmap" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
