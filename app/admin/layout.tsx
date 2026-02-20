"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { isAdminAuthenticated, signOutAdmin } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="container py-10 text-sm text-muted-foreground">
        Loading admin tools...
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage quiz sets and questions stored in Supabase.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Overview</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/quiz-sets">Quiz sets</Link>
          </Button>
          {pathname !== "/admin/login" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOutAdmin();
                router.replace("/admin/login");
              }}
            >
              Sign out
            </Button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}
