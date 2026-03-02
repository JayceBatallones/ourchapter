"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MemberWithProjects } from "@/lib/types";
import { layoutNodes, getInitials } from "@/lib/node-layout";
import { SocialLinks } from "@/components/social-icons";
import { ExternalLink } from "lucide-react";

type Props = {
  members: MemberWithProjects[];
  totalCount?: number;
};

export function MemberNodes({ members, totalCount }: Props) {
  const layoutResult = layoutNodes(members.map((m) => m.id));

  const [positions, setPositions] = useState<{ x: number; y: number }[]>(
    () => layoutResult.map((n) => ({ x: n.cx, y: n.cy })),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const didDrag = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Dismiss pinned card on click-outside or Escape
  useEffect(() => {
    if (pinnedIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPinnedIndex(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [pinnedIndex]);

  const toPercent = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 50, y: 50 };
      return {
        x: Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(3, Math.min(97, ((clientY - rect.top) / rect.height) * 100)),
      };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, i: number) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pct = toPercent(e.clientX, e.clientY);
      dragOffset.current = {
        x: pct.x - positions[i].x,
        y: pct.y - positions[i].y,
      };
      didDrag.current = false;
      setDraggingIndex(i);
    },
    [positions, toPercent],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingIndex === null) return;
      didDrag.current = true;
      const pct = toPercent(e.clientX, e.clientY);
      setPositions((prev) => {
        const next = [...prev];
        next[draggingIndex] = {
          x: Math.max(3, Math.min(97, pct.x - dragOffset.current.x)),
          y: Math.max(3, Math.min(97, pct.y - dragOffset.current.y)),
        };
        return next;
      });
    },
    [draggingIndex, toPercent],
  );

  const handlePointerUp = useCallback(
    (i?: number) => {
      // If it was a click (no drag), toggle pin
      if (!didDrag.current && i !== undefined) {
        setPinnedIndex((prev) => (prev === i ? null : i));
      }
      setDraggingIndex(null);
    },
    [],
  );

  // The card shows for: pinned node, or hovered node (when nothing is pinned)
  const activeIndex = pinnedIndex ?? (draggingIndex === null ? hoveredIndex : null);
  const activeMember = activeIndex !== null ? members[activeIndex] : null;
  const activePos = activeIndex !== null ? positions[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square border border-white/10 overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={() => handlePointerUp()}
      onPointerLeave={() => { setDraggingIndex(null); }}
      onClick={(e) => {
        // Click on empty space dismisses pinned card
        if (e.target === e.currentTarget) setPinnedIndex(null);
      }}
    >
      {/* Dots */}
      {positions.map((pos, i) => {
        const initials = getInitials(members[i]?.full_name);
        const isActive = activeIndex === i;
        const isDragging = draggingIndex === i;

        return (
          <div
            key={members[i]?.id ?? i}
            className="absolute -translate-x-1/2 -translate-y-1/2 touch-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              zIndex: isDragging ? 20 : isActive ? 10 : 1,
            }}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerUp={(e) => { e.stopPropagation(); handlePointerUp(i); }}
            onMouseEnter={() => {
              if (draggingIndex === null) setHoveredIndex(i);
            }}
            onMouseLeave={() => {
              if (draggingIndex === null) setHoveredIndex(null);
            }}
          >
            <div
              className={[
                "flex items-center justify-center rounded-full border transition-all duration-150 cursor-grab active:cursor-grabbing",
                isActive || isDragging
                  ? "bg-white/20 border-white/40 scale-110"
                  : "bg-white/[0.07] border-white/15",
              ].join(" ")}
              style={{ width: 40, height: 40 }}
            >
              <span
                className={[
                  "text-[11px] font-semibold font-mono pointer-events-none transition-colors duration-150",
                  isActive || isDragging
                    ? "text-white/90"
                    : "text-white/50",
                ].join(" ")}
              >
                {initials}
              </span>
            </div>
          </div>
        );
      })}

      {/* Card — pinned (interactive) or hovered (pointer-events-none) */}
      {activeMember && activePos && draggingIndex === null && (
        <div
          className={pinnedIndex !== null ? "absolute z-30" : "absolute z-30 pointer-events-none"}
          style={{
            left: `${activePos.x}%`,
            top: `${activePos.y}%`,
            transform:
              activePos.y > 65
                ? "translate(-50%, calc(-100% - 30px))"
                : "translate(-50%, 28px)",
          }}
        >
          <div className="bg-black/90 border border-white/15 rounded-lg shadow-2xl p-4 min-w-[220px] max-w-[260px] backdrop-blur-sm">
            <p className="font-semibold text-sm text-white">
              {activeMember.full_name ?? "Anonymous"}
            </p>
            {activeMember.username && (
              <p className="text-[11px] text-white/40 font-mono">
                @{activeMember.username}
              </p>
            )}
            {activeMember.bio && (
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                {activeMember.bio}
              </p>
            )}
            {activeMember.projects.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider font-mono">
                  Building
                </p>
                {activeMember.projects.map((project) => (
                  <div key={project.name} className="flex items-center gap-1.5">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/80 hover:text-white inline-flex items-center gap-1"
                      >
                        {project.name}
                        <ExternalLink className="h-2.5 w-2.5 text-white/40" />
                      </a>
                    ) : (
                      <span className="text-xs text-white/80">
                        {project.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeMember.projects.length === 0 &&
              activeMember.what_building && (
                <p className="text-xs text-white/60 mt-2 leading-relaxed">
                  {activeMember.what_building}
                </p>
              )}
            <div className="mt-3">
              <SocialLinks
                website={activeMember.website}
                twitter={activeMember.twitter}
                github={activeMember.github}
                linkedin={activeMember.linkedin}
                instagram={activeMember.instagram}
                youtube={activeMember.youtube}
                tiktok={activeMember.tiktok}
              />
            </div>
          </div>
        </div>
      )}

      <p className="absolute bottom-3 left-4 text-xs text-muted-foreground pointer-events-none">
        <span className="text-foreground font-semibold">
          {totalCount ?? members.length}
        </span>{" "}
        builders and counting
      </p>
    </div>
  );
}
