import { AuthButton } from "@/components/auth-button";
import { PixelLogo } from "@/components/pixel-logo";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <nav className="w-full border-b border-white/10">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-3 px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center">
            <PixelLogo className="h-3 w-auto text-white" />
          </Link>
          {hasEnvVars && (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/30 tracking-wider">
            OUR CHAPTER
          </span>
          <span className="text-[9px] font-mono text-white/30 tracking-wider">
            V1.0.0
          </span>
        </div>
      </footer>
    </main>
  );
}
