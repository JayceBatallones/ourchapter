"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { MemberWithProjects } from "@/lib/types";
import { SocialLinks } from "@/components/social-icons";
import { ExternalLink, X } from "lucide-react";

type Props = {
  members: MemberWithProjects[];
  totalCount?: number;
};

function hashToFloat(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 10000) / 10000;
}

function WindowDots({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-white/20" : "bg-white/10"}`}
      />
      <div
        className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-white/15" : "bg-white/[0.07]"}`}
      />
      <div
        className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-white/10" : "bg-white/[0.05]"}`}
      />
    </div>
  );
}

/** Fibonacci sphere: distribute N points evenly on a sphere */
function distributePoints(
  count: number,
  radius = 1.4
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push([
      Math.cos(theta) * radiusAtY * radius,
      y * radius,
      Math.sin(theta) * radiusAtY * radius,
    ]);
  }
  return points;
}

/** Individual card marker positioned on the sphere surface */
function MemberMarker({
  member,
  position,
  onSelect,
}: {
  member: MemberWithProjects;
  position: [number, number, number];
  onSelect: (member: MemberWithProjects) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = hashToFloat(member.id + "theme") > 0.35;
  const firstProject = member.projects[0];

  // Depth-aware scaling via dot product
  useFrame(({ camera }) => {
    if (!cardRef.current) return;

    const markerPos = new THREE.Vector3(...position);
    const camDir = new THREE.Vector3()
      .subVectors(camera.position, markerPos)
      .normalize();
    const markerNormal = markerPos.clone().normalize();
    const dot = camDir.dot(markerNormal);

    const t = THREE.MathUtils.clamp((dot + 1) / 2, 0, 1);
    const scale = THREE.MathUtils.lerp(0.7, 1.3, t);
    const opacity = THREE.MathUtils.lerp(0.1, 1.0, t);
    const w = Math.round(170 * scale);

    cardRef.current.style.width = `${w}px`;
    cardRef.current.style.opacity = String(opacity);
    cardRef.current.style.pointerEvents = t < 0.25 ? "none" : "auto";
  });

  return (
    <group position={position}>
      <Html center distanceFactor={6} zIndexRange={[100, 0]}>
        <div
          ref={cardRef}
          className="cursor-pointer w-[170px]"
          onClick={() => onSelect(member)}
        >
          <div
            className={[
              "rounded-lg overflow-hidden border shadow-2xl transition-transform duration-150 hover:scale-105",
              isDark
                ? "bg-black/95 border-white/10"
                : "bg-white/[0.04] border-white/15",
            ].join(" ")}
          >
            {/* Title bar */}
            <div
              className={[
                "flex items-center gap-2 px-2.5 py-1.5 border-b",
                isDark
                  ? "bg-black border-white/[0.06]"
                  : "bg-white/[0.03] border-white/10",
              ].join(" ")}
            >
              <WindowDots dark={isDark} />
              <span className="text-[8px] font-mono text-white/25 truncate ml-1">
                {member.username ? `@${member.username}` : "member"}
              </span>
            </div>

            {/* Content */}
            <div className="p-2.5">
              <p className="text-[11px] font-semibold text-white/85 font-mono truncate">
                {member.full_name ?? "Anonymous"}
              </p>
              {(member.bio || firstProject || member.what_building) && (
                <p className="text-[9px] text-white/35 font-mono mt-1 line-clamp-2 leading-relaxed">
                  {member.bio ?? firstProject?.name ?? member.what_building}
                </p>
              )}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Expanded card shown fixed in place over the globe */
function ExpandedCard({
  member,
  onClose,
}: {
  member: MemberWithProjects;
  onClose: () => void;
}) {
  const isDark = hashToFloat(member.id + "theme") > 0.35;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-[200] flex items-center justify-center globe-overlay-enter"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className={[
          "relative w-[340px] rounded-xl overflow-hidden border shadow-2xl globe-profile-enter",
          isDark
            ? "bg-[#0a0a0a] border-white/10"
            : "bg-[#111] border-white/15",
        ].join(" ")}
      >
        {/* Title bar */}
        <div
          className={[
            "flex items-center justify-between px-4 py-3 border-b",
            isDark
              ? "bg-black border-white/[0.06]"
              : "bg-white/[0.03] border-white/10",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            <WindowDots dark={isDark} />
            <span className="text-[10px] font-mono text-white/30 ml-1">
              {member.username ? `@${member.username}` : "member"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Profile content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white/90 font-mono">
              {member.full_name ?? "Anonymous"}
            </h3>
            {member.username && (
              <p className="text-xs text-white/35 font-mono mt-0.5">
                @{member.username}
              </p>
            )}
          </div>

          {member.bio && (
            <p className="text-xs text-white/50 font-mono leading-relaxed">
              {member.bio}
            </p>
          )}

          {member.projects.length > 0 && (
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-2">
                Building
              </p>
              <div className="space-y-1.5">
                {member.projects.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center gap-1.5"
                  >
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/60 hover:text-white font-mono inline-flex items-center gap-1.5 transition-colors"
                      >
                        {project.name}
                        <ExternalLink className="h-2.5 w-2.5 text-white/30" />
                      </a>
                    ) : (
                      <span className="text-xs text-white/60 font-mono">
                        {project.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {member.projects.length === 0 && member.what_building && (
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1">
                Building
              </p>
              <p className="text-xs text-white/50 font-mono">
                {member.what_building}
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <SocialLinks
              website={member.website}
              twitter={member.twitter}
              github={member.github}
              linkedin={member.linkedin}
              instagram={member.instagram}
              youtube={member.youtube}
              tiktok={member.tiktok}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemberNodes({ members, totalCount }: Props) {
  // Suppress THREE.Clock deprecation warning from @react-three/fiber internals
  // until fiber migrates to THREE.Timer (https://github.com/pmndrs/react-three-fiber/issues/3153)
  useEffect(() => {
    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
      origWarn.apply(console, args);
    };
    return () => { console.warn = origWarn; };
  }, []);

  const [expandedMember, setExpandedMember] =
    useState<MemberWithProjects | null>(null);

  const count = Math.min(members.length, 12);
  const positions = useMemo(() => distributePoints(count), [count]);

  const handleSelect = useCallback((member: MemberWithProjects) => {
    setExpandedMember(member);
  }, []);

  return (
    <div className="relative w-full aspect-square select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={4}
          maxDistance={10}
        />
        {members.slice(0, count).map((member, i) => (
          <MemberMarker
            key={member.id}
            member={member}
            position={positions[i]}
            onSelect={handleSelect}
          />
        ))}
      </Canvas>

      {expandedMember && (
        <ExpandedCard
          member={expandedMember}
          onClose={() => setExpandedMember(null)}
        />
      )}

      <p className="absolute bottom-3 left-4 text-xs text-muted-foreground pointer-events-none z-[101]">
        <span className="text-foreground font-semibold">
          {totalCount ?? members.length}
        </span>{" "}
        builders and counting
      </p>
    </div>
  );
}
