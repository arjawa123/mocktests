import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col gap-10 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          JFT Quiz Practice
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Train with official-style mockups and kisi-kisi drills
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Pick a mode to start practicing. Your progress is saved locally so you can
          resume anytime.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>JFT Mockup Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Full-length mock tests with sections and audio support. Simulates the
              real JFT experience.
            </p>
            <Button asChild>
              <Link href="/quiz/jft-mockup">Start mockup quiz</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kisi-kisi Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Quick drills from kisi-kisi review data. Ideal for daily practice and
              vocabulary checks.
            </p>
            <Button asChild>
              <Link href="/quiz/kisi-kisi">Start kisi-kisi quiz</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      <section>
        <Button variant="outline" asChild>
          <Link href="/history">View progress history</Link>
        </Button>
      </section>
    </main>
  );
}
