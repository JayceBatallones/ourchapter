import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { ProjectsList } from "@/components/projects-list";
import { MemberProfile, Project } from "@/lib/types";
import { Suspense } from "react";

async function ProtectedContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: true });

  const memberProfile: MemberProfile = {
    id: user.id,
    full_name: profile?.full_name ?? null,
    username: profile?.username ?? null,
    bio: profile?.bio ?? null,
    what_building: profile?.what_building ?? null,
    website: profile?.website ?? null,
    twitter: profile?.twitter ?? null,
    linkedin: profile?.linkedin ?? null,
    github: profile?.github ?? null,
    instagram: profile?.instagram ?? null,
    youtube: profile?.youtube ?? null,
    tiktok: profile?.tiktok ?? null,
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-px bg-white/30" />
          <h1 className="text-xs font-mono font-bold text-white/60 tracking-[0.2em] uppercase">
            Your Profile
          </h1>
        </div>
        <ProfileForm profile={memberProfile} />
      </section>

      <div className="w-full h-px bg-white/10" />

      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-px bg-white/30" />
          <h2 className="text-xs font-mono font-bold text-white/60 tracking-[0.2em] uppercase">
            Your Projects
          </h2>
        </div>
        <ProjectsList
          profileId={user.id}
          initialProjects={(projects as Project[]) ?? []}
        />
      </section>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 w-full flex items-center justify-center">
          <p className="text-muted-foreground text-sm font-mono">Loading...</p>
        </div>
      }
    >
      <ProtectedContent />
    </Suspense>
  );
}
