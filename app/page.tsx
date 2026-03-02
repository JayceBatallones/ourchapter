import Link from "next/link";
import { Suspense } from "react";
import { MemberNodes } from "@/components/member-nodes";
import { PixelLogo } from "@/components/pixel-logo";
import { createClient } from "@/lib/supabase/server";
import { MemberWithProjects } from "@/lib/types";

async function MemberNodesLoader() {
  const supabase = await createClient();
  const [{ data }, { count }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, username, bio, what_building, website, twitter, linkedin, github, instagram, youtube, tiktok, projects(name, url)"
      )
      .eq("status", "approved"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true }),
  ]);

  const members: MemberWithProjects[] = (data ?? []).map((d) => ({
    ...d,
    projects: d.projects ?? [],
  }));
  return <MemberNodes members={members} totalCount={count ?? members.length} />;
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <PixelLogo className="h-3 sm:h-4 w-auto text-white" />
            <div className="h-3 lg:h-4 w-px bg-white/20" />
            <span className="text-white/40 text-[8px] lg:text-[10px] font-mono tracking-wider">
              EST. 2026
            </span>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-white/40">
              <span>BUILDERS.NETWORK</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span>V1.0</span>
            </div>
            <Link
              href="/auth/login"
              className="px-4 py-1.5 text-[10px] lg:text-xs font-mono text-white/60 hover:text-white transition-colors duration-200 tracking-wider"
            >
              LOGIN
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-1.5 text-[10px] lg:text-xs font-mono text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-200 tracking-wider"
            >
              APPLY
            </Link>
          </div>
        </div>
      </header>

      {/* Corner Frame Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-white/20 z-20" />
      <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-white/20 z-20" />
      <div className="absolute bottom-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-white/20 z-20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-white/20 z-20" />

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center pt-16 lg:pt-0">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:pl-[8%]">
          <div className="max-w-lg">
            {/* Top decorative line */}
            <div className="flex items-center gap-2 mb-4 animate-fade-up">
              <div className="w-8 h-px bg-white/40" />
              <span className="text-white/40 text-[10px] font-mono tracking-wider">
                FOR BUILDERS
              </span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Dither accent */}
            <div className="hidden lg:block absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-32 dither-pattern opacity-20" />

            {/* Main headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1] font-mono tracking-wider animate-fade-up-delay-1">
              JUST F*CKIN
              <br />
              SHIP.
            </h1>

            {/* Decorative dots */}
            <div className="hidden lg:flex gap-1 mb-4 opacity-30 animate-fade-up-delay-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full" />
              ))}
            </div>

            {/* Description */}
            <div className="relative animate-fade-up-delay-2">
              <p className="text-sm lg:text-base text-gray-400 mb-6 leading-relaxed font-mono">
                A private community of builders who use AI to ship real
                products — not talk about it. No pitch decks.
                No thought leadership. Just work.
              </p>

              {/* Technical corner accent */}
              <div className="hidden lg:block absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 border border-white/20">
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/40 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-delay-3">
              <Link
                href="/auth/sign-up"
                className="group relative px-6 py-2.5 bg-white text-black font-mono text-xs lg:text-sm tracking-wider hover:bg-white/90 transition-all duration-200 text-center"
              >
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                APPLY FOR MEMBERSHIP
              </Link>

              <Link
                href="/auth/login"
                className="px-6 py-2.5 bg-transparent border border-white/30 text-white font-mono text-xs lg:text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-200 text-center"
              >
                MEMBER LOGIN
              </Link>
            </div>

            {/* Bottom technical notation */}
            <div className="hidden lg:flex items-center gap-2 mt-8 opacity-30">
              <span className="text-white text-[9px] font-mono">&infin;</span>
              <div className="flex-1 h-px bg-white/40" />
              <span className="text-white text-[9px] font-mono">
                CHAPTER.PROTOCOL
              </span>
            </div>
          </div>
        </div>

        {/* Right side — member nodes visualization (desktop) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center px-8 pr-[8%]">
          <div className="w-full max-w-lg opacity-80">
            <Suspense fallback={<div className="w-full aspect-square border border-white/10" />}>
              <MemberNodesLoader />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 w-full h-px gradient-line" />

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-white/40" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              About
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wider font-mono leading-tight">
            WHAT IS OUR
            <br />
            CHAPTER?
          </h2>

          <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-mono">
            <p>
              We&apos;re the people who stopped waiting for permission.
              Builders using Claude Code, OpenClaw, Opencode, Cursor, and whatever else
              gets the job done — shipping products, breaking things, and
              betting on ourselves.
            </p>

            <p>
              No pitch decks. No &quot;thought leadership.&quot; No posting
              threads about AI while never building anything. This is a
              community for people who actually do the work.
            </p>

            <p>
              Share what you&apos;re building, get raw feedback, find
              collaborators who move at your speed. That&apos;s it.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/auth/sign-up"
              className="inline-block px-6 py-2.5 bg-white text-black font-mono text-xs tracking-wider hover:bg-white/90 transition-all duration-200"
            >
              APPLY NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="relative z-20 border-t border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-white/30">
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden lg:flex gap-1">
              {[10, 6, 14, 8, 12, 5, 15, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/20"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono text-white/30">
            <span className="hidden lg:inline">&cir; RENDERING</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/50 rounded-full status-dot" />
              <div className="w-1 h-1 bg-white/30 rounded-full status-dot" />
              <div className="w-1 h-1 bg-white/15 rounded-full status-dot" />
            </div>
            <span className="hidden lg:inline">FRAME: &infin;</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
