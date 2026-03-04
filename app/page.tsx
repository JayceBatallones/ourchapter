import Link from "next/link";
import { Suspense } from "react";
import { MemberNodes } from "@/components/member-nodes";
import { PixelLogo } from "@/components/pixel-logo";
import { SectionHighlighter } from "@/components/section-highlighter";
import { createClient } from "@/lib/supabase/server";
import { MemberWithProjects } from "@/lib/types";

async function MemberNodesLoader() {
  const supabase = await createClient();
  const [profilesResult, countResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, username, bio, location, what_building, website, twitter, linkedin, github, instagram, youtube, tiktok, status, projects(name, url)"
      )
      .eq("status", "approved"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  const members: MemberWithProjects[] = (profilesResult.data ?? []).map((d) => ({
    ...d,
    projects: d.projects ?? [],
  }));
  return <MemberNodes members={members} totalCount={countResult.count ?? members.length} />;
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <SectionHighlighter
        sections={[
          { id: "hero", label: "Hero" },
          { id: "about", label: "What" },
          { id: "not-for", label: "Not For" },
          { id: "cta", label: "Apply" },
        ]}
      />

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <PixelLogo className="h-3 sm:h-4 w-auto text-white" />
            <div className="h-3 lg:h-4 w-px bg-white/20" />
            <span className="text-white/40 text-[8px] lg:text-[10px] font-mono tracking-wider">
              EST. 2026
            </span>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
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
      <section id="hero" className="relative z-10 flex min-h-screen items-center pt-16 lg:pt-20">
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
                A private community of builders shipping real products with AI.
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
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/15 bg-white/[0.02] px-5 py-8 lg:px-10 lg:py-10">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40" />

            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-white/40" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                About
              </p>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wider font-mono leading-tight">
              WHAT IS OUR
              <br />
              CHAPTER?
            </h2>

            <div className="mt-5 space-y-4 text-gray-400 text-sm leading-relaxed font-mono max-w-2xl">
              <p>
                The best builders don&apos;t know the other best builders yet.
                Most communities are passive, noisy, or already stale.
              </p>
              <p>
                This is for high-agency people using AI to ship — not post about it.
                Share what you&apos;re building, get raw feedback, find collaborators
                who move at your speed.
              </p>
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-3 text-gray-300 text-sm leading-relaxed font-mono">
              <li className="border border-white/10 px-3 py-2 bg-black/40">Ship logs over status updates.</li>
              <li className="border border-white/10 px-3 py-2 bg-black/40">Raw feedback over polite noise.</li>
              <li className="border border-white/10 px-3 py-2 bg-black/40">Speed over endless debate.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Not For Section */}
      <section
        id="not-for"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pb-24 lg:pb-32"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/15 bg-white/[0.01] px-5 py-8 lg:px-10 lg:py-10">
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/40" />

            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-white/40" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                Not For
              </p>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wider font-mono leading-tight">
              NOT FOR
              <br />
              EVERYONE.
            </h2>

            <ul className="mt-7 space-y-2 text-white/85 text-sm leading-relaxed font-mono">
              <li className="flex items-center gap-3 border border-white/10 px-3 py-2 bg-black/40">
                <span className="text-white/50">[x]</span>
                <span>Passive motivation seekers.</span>
              </li>
              <li className="flex items-center gap-3 border border-white/10 px-3 py-2 bg-black/40">
                <span className="text-white/50">[x]</span>
                <span>Trend chasers switching lanes weekly.</span>
              </li>
              <li className="flex items-center gap-3 border border-white/10 px-3 py-2 bg-black/40">
                <span className="text-white/50">[x]</span>
                <span>Default cynics.</span>
              </li>
              <li className="flex items-center gap-3 border border-white/10 px-3 py-2 bg-black/40">
                <span className="text-white/50">[x]</span>
                <span>Personal brand first, product second.</span>
              </li>
              <li className="flex items-center gap-3 border border-white/10 px-3 py-2 bg-black/40">
                <span className="text-white/50">[x]</span>
                <span>People who prefer noise over honest feedback.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pb-20 lg:pb-24">
        <div className="max-w-4xl mx-auto border border-white/15 bg-white/[0.02] px-5 py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wider font-mono leading-tight">
                READY TO BUILD?
              </h3>
            </div>

            <Link
              href="/auth/sign-up"
              className="group relative inline-block px-6 py-2.5 bg-white text-black font-mono text-xs tracking-wider hover:bg-white/90 transition-all duration-200 text-center"
            >
              <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
              APPLY FOR MEMBERSHIP
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer
        id="footer"
        className="relative z-20 border-t border-white/10 bg-black/60 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-white/30">
            <span className="hidden lg:inline">OUR CHAPTER</span>
            <span className="lg:hidden">OURCHPTR</span>
            <div className="hidden lg:flex gap-1">
              {[10, 6, 14, 8, 12, 5, 15, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/20"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span>EST. 2026</span>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono text-white/30">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/50 rounded-full status-dot" />
              <div className="w-1 h-1 bg-white/30 rounded-full status-dot" />
              <div className="w-1 h-1 bg-white/15 rounded-full status-dot" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
