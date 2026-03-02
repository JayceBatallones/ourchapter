"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
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
        <form onSubmit={handleUpdatePassword}>
          <div className="flex flex-col gap-5">
            <p className="text-xs font-mono text-white/50 leading-relaxed">
              Please enter your new password below.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs font-mono text-white/60 tracking-wider uppercase">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="New password"
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
              {isLoading ? "SAVING..." : "SAVE NEW PASSWORD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
