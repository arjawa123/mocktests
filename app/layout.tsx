import "./globals.css";
import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}
