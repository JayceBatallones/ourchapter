import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationForm } from "@/components/application-form";
import { PixelLogo } from "@/components/pixel-logo";
import Link from "next/link";
import { Suspense } from "react";

async function ApplyContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, bio, location, status")
    .eq("id", user.id)
    .maybeSingle();

  // Ensure profile exists (fallback if trigger didn't fire)
  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name ?? null,
        },
        { onConflict: "id" },
      )
      .select("full_name, username, bio, location, status")
      .single();
    profile = created;
  }

  if (profile?.status === "approved") {
    redirect("/protected");
  }

  const { data: application } = await supabase
    .from("applications")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const isPending = !!application;

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-black p-6 md:p-10">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Link href="/">
            <PixelLogo className="h-3 w-auto text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-white/20" />
            <span className="text-[10px] font-mono text-white/40 tracking-wider">
              APPLICATION
            </span>
            <div className="w-6 h-px bg-white/20" />
          </div>
        </div>
        <ApplicationForm
          profileId={user.id}
          pending={isPending}
          initialData={{
            full_name: profile?.full_name ?? user.user_metadata?.full_name ?? "",
            username: profile?.username ?? "",
            location: profile?.location ?? "",
            bio: profile?.bio ?? "",
          }}
        />
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center bg-black">
          <p className="text-muted-foreground text-sm font-mono">Loading...</p>
        </div>
      }
    >
      <ApplyContent />
    </Suspense>
  );
}
