import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Headphones, History, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col gap-8 py-10 sm:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-hero-gradient p-6 text-slate-100 shadow-lift sm:p-10">
        <div className="relative z-10 space-y-5">
          <Badge variant="info" className="bg-white/15 text-slate-100">
            Professional Practice Suite
          </Badge>
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
            Train smarter for JFT with polished mock exams and targeted drills
          </h1>
          <p className="max-w-2xl text-sm text-slate-200/90 sm:text-base">
            Two quiz modes, synced progress, and detailed history analytics in one
            focused learning workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="gradient" asChild>
              <Link href="/quiz/jft-mockup">
                Start mockup mode
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="border-white/35 bg-white/10 text-slate-100 hover:bg-white/20" asChild>
              <Link href="/quiz/kisi-kisi">Start kisi-kisi mode</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="group surface-gradient animate-slide-up">
          <CardHeader className="space-y-3">
            <Badge>JFT Mockup</Badge>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Full Simulation Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Full-length sections with listening assets and section navigation,
              designed to mirror real test rhythm.
            </p>
            <Button className="group-hover:translate-x-1" asChild>
              <Link href="/quiz/jft-mockup">
                Open Mockup
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="group surface-gradient animate-slide-up">
          <CardHeader className="space-y-3">
            <Badge variant="success">Kisi-kisi</Badge>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-info" />
              Fast Daily Drills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Focused vocabulary and structure practice with quick feedback,
              perfect for short daily sessions.
            </p>
            <Button variant="gradient" className="group-hover:translate-x-1" asChild>
              <Link href="/quiz/kisi-kisi">
                Open Kisi-kisi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass">
          <CardContent className="flex items-center gap-3 p-5 text-sm">
            <Sparkles className="h-5 w-5 text-warning" />
            Rich interaction and polished learning flow
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center gap-3 p-5 text-sm">
            <BarChart3 className="h-5 w-5 text-info" />
            Performance trends from your quiz history
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center gap-3 p-5 text-sm">
            <History className="h-5 w-5 text-success" />
            Resume progress seamlessly across sessions
          </CardContent>
        </Card>
      </section>

      <section>
        <Button variant="outline" asChild>
          <Link href="/history">
            View progress history
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
