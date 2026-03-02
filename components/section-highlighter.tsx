"use client";

import { useEffect, useMemo, useState } from "react";

type SectionLink = {
  id: string;
  label: string;
};

type SectionHighlighterProps = {
  sections: SectionLink[];
};

export function SectionHighlighter({ sections }: SectionHighlighterProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.15, 0.4, 0.65],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Landing page sections"
      className="fixed right-4 top-24 z-30 flex flex-col items-end gap-3 lg:top-28"
    >
      {sections.map((section) => {
        const active = section.id === activeId;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => jumpTo(section.id)}
            aria-label={`Jump to ${section.label}`}
            className="group flex items-center gap-3"
          >
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/0 transition-all duration-200 group-hover:text-white/50 group-focus-visible:text-white/50">
              {section.label}
            </span>
            <span
              className={`h-1 rounded-full transition-all duration-200 ${
                active
                  ? "w-11 bg-white shadow-[0_0_10px_rgba(255,255,255,0.75)]"
                  : "w-10 bg-white/35 hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
