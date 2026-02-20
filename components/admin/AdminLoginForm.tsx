"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInAdmin } from "@/lib/admin-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = signInAdmin(username, password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Try admin / Rjw#2023.");
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Admin login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3"
              required
            />
          </label>
          <label className="grid gap-1 text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3"
              required
            />
          </label>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
