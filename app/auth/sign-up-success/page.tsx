import Link from "next/link";
import { PixelLogo } from "@/components/pixel-logo";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-black p-6 md:p-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Link href="/">
            <PixelLogo className="h-3 w-auto text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-white/20" />
            <span className="text-[10px] font-mono text-white/40 tracking-wider">
              APPLICATION RECEIVED
            </span>
            <div className="w-6 h-px bg-white/20" />
          </div>
        </div>

        <div className="border border-white/10 p-6 space-y-4">
          <h1 className="text-lg font-mono font-bold text-white tracking-wider">
            THANK YOU FOR SIGNING UP
          </h1>
          <p className="text-sm font-mono text-white/50 leading-relaxed">
            You&apos;ve successfully signed up. Please check your email to
            confirm your account before signing in.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-block px-5 py-2 text-xs font-mono text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-200 tracking-wider"
            >
              GO TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
