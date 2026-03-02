"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="border border-white/10 p-6">
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-mono text-white/60 tracking-wider uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-white/10 text-white font-mono text-sm placeholder:text-white/20 focus:border-white/30 focus:ring-0"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-xs font-mono text-white/60 tracking-wider uppercase">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto text-[10px] font-mono text-white/40 hover:text-white transition-colors tracking-wider"
                >
                  FORGOT?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-white/10 text-white font-mono text-sm placeholder:text-white/20 focus:border-white/30 focus:ring-0"
              />
            </div>
            {error && (
              <p className="text-xs font-mono text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-white text-black font-mono text-xs tracking-wider hover:bg-white/90 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </div>
          <div className="mt-5 text-center text-xs font-mono text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-white/70 hover:text-white transition-colors"
            >
              Apply
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
