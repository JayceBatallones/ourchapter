import Link from "next/link";
import { PixelLogo } from "@/components/pixel-logo";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <p className="text-sm font-mono text-white/50 leading-relaxed">
      {params?.error
        ? `Code error: ${params.error}`
        : "An unspecified error occurred."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
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
              ERROR
            </span>
            <div className="w-6 h-px bg-white/20" />
          </div>
        </div>

        <div className="border border-white/10 p-6 space-y-4">
          <h1 className="text-lg font-mono font-bold text-white tracking-wider">
            SOMETHING WENT WRONG
          </h1>
          <Suspense>
            <ErrorContent searchParams={searchParams} />
          </Suspense>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2 text-xs font-mono text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-200 tracking-wider"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
