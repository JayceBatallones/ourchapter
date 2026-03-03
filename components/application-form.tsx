"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = {
  full_name: string;
  username: string;
  location: string;
  bio: string;
  what_building: string;
  link_url: string;
  contribution: string;
  referral_source: string;
};

const STEPS = [
  { number: "01", label: "ABOUT YOU" },
  { number: "02", label: "WHAT YOU'RE BUILDING" },
  { number: "03", label: "REVIEW & SUBMIT" },
];

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 font-mono text-xs tracking-wider mb-10">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex items-center">
          <span
            className={
              i <= currentStep ? "text-white" : "text-white/30"
            }
          >
            {step.number}
          </span>
          {i < STEPS.length - 1 && (
            <div className="w-12 mx-2 flex items-center">
              <div
                className={`w-full border-t ${
                  i < currentStep
                    ? "border-white border-solid"
                    : "border-white/30 border-dashed"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PendingBox() {
  return (
    <div className="border border-white/20 p-8 text-center space-y-4">
      <div className="inline-block border border-white/40 px-3 py-1">
        <span className="text-xs font-mono tracking-widest text-white/80">
          PENDING
        </span>
      </div>
      <p className="text-sm font-mono text-white/60">
        Your application has been submitted.
      </p>
      <p className="text-sm font-mono text-white/40">
        We&apos;ll get back to you soon.
      </p>
    </div>
  );
}

export function ApplicationForm({
  profileId,
  initialData,
  pending,
}: {
  profileId: string;
  initialData?: Partial<FormData>;
  pending?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    full_name: initialData?.full_name ?? "",
    username: initialData?.username ?? "",
    location: initialData?.location ?? "",
    bio: initialData?.bio ?? "",
    what_building: initialData?.what_building ?? "",
    link_url: initialData?.link_url ?? "",
    contribution: initialData?.contribution ?? "",
    referral_source: initialData?.referral_source ?? "",
  });

  if (pending || submitted) {
    return (
      <div className="w-full">
        <PendingBox />
      </div>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    // Update profile with step 1 fields + what_building for public member cards
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name || null,
        username: formData.username || null,
        location: formData.location || null,
        bio: formData.bio || null,
        what_building: formData.what_building || null,
      })
      .eq("id", profileId);

    if (profileError) {
      setError(profileError.message);
      setSubmitting(false);
      return;
    }

    // Upsert application with step 2 fields (private)
    const { error: appError } = await supabase
      .from("applications")
      .upsert(
        {
          profile_id: profileId,
          what_building: formData.what_building || null,
          link_url: formData.link_url || null,
          contribution: formData.contribution || null,
          referral_source: formData.referral_source || null,
        },
        { onConflict: "profile_id" },
      );

    if (appError) {
      setError(appError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="w-full">
      <ProgressIndicator currentStep={step} />

      <div className="border border-white/10 p-6 sm:p-8">
        {/* Step header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-px bg-white/30" />
          <span className="text-[10px] font-mono text-white/40 tracking-wider">
            STEP {STEPS[step].number} — {STEPS[step].label}
          </span>
        </div>

        {/* Step 1: About You */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="full_name"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                FULL NAME <span className="text-red-400">*</span>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                className="font-mono bg-transparent border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                USERNAME <span className="text-red-400">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_handle"
                className="font-mono bg-transparent border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                LOCATION <span className="text-red-400">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Sydney, AU"
                className="font-mono bg-transparent border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                SHORT BIO <span className="text-red-400">*</span>
              </Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="A sentence or two about yourself"
                className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm font-mono text-white shadow-sm placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        {/* Step 2: What You're Building */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="what_building"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                WHAT ARE YOU BUILDING / HAVE YOU SHIPPED? <span className="text-red-400">*</span>
              </Label>
              <textarea
                id="what_building"
                name="what_building"
                value={formData.what_building}
                onChange={handleChange}
                rows={3}
                placeholder="What you're working on now and what you've shipped recently"
                className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm font-mono text-white shadow-sm placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="link_url"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                LINK TO YOUR WORK <span className="text-red-400">*</span>
              </Label>
              <Input
                id="link_url"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                placeholder="https://..."
                className="font-mono bg-transparent border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="contribution"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                WHAT WOULD YOU CONTRIBUTE TO THE COMMUNITY? <span className="text-red-400">*</span>
              </Label>
              <textarea
                id="contribution"
                name="contribution"
                value={formData.contribution}
                onChange={handleChange}
                rows={3}
                placeholder="Feedback, expertise, collaborations, etc."
                className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm font-mono text-white shadow-sm placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="referral_source"
                className="text-xs font-mono text-white/60 tracking-wider"
              >
                HOW DID YOU HEAR ABOUT US? <span className="text-red-400">*</span>
              </Label>
              <Input
                id="referral_source"
                name="referral_source"
                value={formData.referral_source}
                onChange={handleChange}
                placeholder="Twitter, a friend, etc."
                className="font-mono bg-transparent border-white/10 text-white placeholder:text-white/20"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  FULL NAME
                </p>
                <p className="text-sm font-mono text-white">
                  {formData.full_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  USERNAME
                </p>
                <p className="text-sm font-mono text-white">
                  {formData.username || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  LOCATION
                </p>
                <p className="text-sm font-mono text-white">
                  {formData.location || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  BIO
                </p>
                <p className="text-sm font-mono text-white whitespace-pre-wrap">
                  {formData.bio || "—"}
                </p>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  WHAT ARE YOU BUILDING / HAVE YOU SHIPPED?
                </p>
                <p className="text-sm font-mono text-white whitespace-pre-wrap">
                  {formData.what_building || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  LINK TO YOUR WORK
                </p>
                <p className="text-sm font-mono text-white">
                  {formData.link_url || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  WHAT WOULD YOU CONTRIBUTE?
                </p>
                <p className="text-sm font-mono text-white whitespace-pre-wrap">
                  {formData.contribution || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-wider mb-1">
                  HOW DID YOU HEAR ABOUT US?
                </p>
                <p className="text-sm font-mono text-white">
                  {formData.referral_source || "—"}
                </p>
              </div>
            </div>

            {error && (
              <p className="text-xs font-mono text-red-400">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className={`px-4 py-2.5 font-mono text-xs tracking-wider text-white/60 hover:text-white transition-colors ${
            step === 0 ? "invisible" : ""
          }`}
        >
          BACK
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 0 && (!formData.full_name.trim() || !formData.username.trim() || !formData.location.trim() || !formData.bio.trim())) ||
              (step === 1 && (!formData.what_building.trim() || !formData.link_url.trim() || !formData.contribution.trim() || !formData.referral_source.trim()))
            }
            className="px-6 py-2.5 bg-white text-black font-mono text-xs tracking-wider hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            CONTINUE
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-white text-black font-mono text-xs tracking-wider hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </button>
        )}
      </div>
    </div>
  );
}
