import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "JFT Quiz",
  description: "JFT mockup and kisi-kisi quiz practice"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="min-h-screen">
            <header className="border-b border-border">
              <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
                <Link href="/" className="text-sm font-semibold">
                  JFT Quiz
                </Link>
                <nav className="flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/history">History</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
