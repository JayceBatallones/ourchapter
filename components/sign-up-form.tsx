"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="border border-white/10 p-6">
        <form onSubmit={handleSignUp}>
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
              <Label htmlFor="password" className="text-xs font-mono text-white/60 tracking-wider uppercase">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-white/10 text-white font-mono text-sm placeholder:text-white/20 focus:border-white/30 focus:ring-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeat-password" className="text-xs font-mono text-white/60 tracking-wider uppercase">
                Confirm Password
              </Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
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
              {isLoading ? "CREATING ACCOUNT..." : "SUBMIT APPLICATION"}
            </button>
          </div>
          <div className="mt-5 text-center text-xs font-mono text-white/40">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
