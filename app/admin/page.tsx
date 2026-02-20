"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAdminQuizSets } from "@/lib/supabase/admin";
import type { QuizSet } from "@/types/quiz";

export default function AdminPage() {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAdminQuizSets();
      setQuizSets(data);
    };
    load();
  }, []);

  const mockups = quizSets.filter((set) => set.mode === "jft-mockup").length;
  const kisi = quizSets.filter((set) => set.mode === "kisi-kisi").length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total quiz sets</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{quizSets.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>JFT Mockup sets</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{mockups}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kisi-kisi sets</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{kisi}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/quiz-sets">Manage quiz sets</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/quiz-sets/new">Create new quiz set</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
