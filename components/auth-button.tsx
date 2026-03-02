import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.sub)
      .single();
    displayName = profile?.full_name ?? null;
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-xs font-mono text-white/50">
        {displayName || user.email}
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="text-xs font-mono text-white/50 hover:text-white transition-colors tracking-wider"
      >
        LOGIN
      </Link>
      <Link
        href="/auth/sign-up"
        className="px-4 py-1.5 text-xs font-mono text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-200 tracking-wider"
      >
        APPLY
      </Link>
    </div>
  );
}
