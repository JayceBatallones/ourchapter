"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="border border-white/10 p-6">
        {success ? (
          <div className="space-y-4">
            <h2 className="text-lg font-mono font-bold text-white tracking-wider">
              CHECK YOUR EMAIL
            </h2>
            <p className="text-sm font-mono text-white/50 leading-relaxed">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-block px-5 py-2 text-xs font-mono text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-200 tracking-wider"
              >
                BACK TO LOGIN
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-5">
              <p className="text-xs font-mono text-white/50 leading-relaxed">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
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
              {error && (
                <p className="text-xs font-mono text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-white text-black font-mono text-xs tracking-wider hover:bg-white/90 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? "SENDING..." : "SEND RESET EMAIL"}
              </button>
            </div>
            <div className="mt-5 text-center text-xs font-mono text-white/40">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-white/70 hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
