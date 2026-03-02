"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={logout}
      className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-mono text-white/50 border border-white/10 hover:border-white/30 hover:text-white transition-all duration-200 tracking-wider"
    >
      LOGOUT
    </button>
  );
}
