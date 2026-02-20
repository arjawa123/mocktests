import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, Shield } from "lucide-react";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "JFT Quiz Pro",
  description: "Professional JFT mockup and kisi-kisi quiz practice platform"
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
            <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl">
              <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
                <Link href="/" className="group flex items-center gap-2 text-sm font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <BookOpenCheck className="h-4 w-4" />
                  </span>
                  <span className="text-gradient text-base">JFT Quiz Pro</span>
                </Link>
                <nav className="flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/history">History</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">
                      <Shield className="h-3.5 w-3.5" />
                      Admin
                    </Link>
                  </Button>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <div className="animate-fade-in">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
