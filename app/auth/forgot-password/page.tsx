import { ForgotPasswordForm } from "@/components/forgot-password-form";
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
              RESET PASSWORD
            </span>
            <div className="w-6 h-px bg-white/20" />
          </div>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
