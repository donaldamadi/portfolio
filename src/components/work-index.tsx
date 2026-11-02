"use client";

import Link from "next/link";
import { useState } from "react";
import { work } from "@/content/work";
import type { Platform } from "@/content/types";
import { BadgeList, ExternalLink, Panel, Section, Tray } from "./primitives";
import { cn } from "@/lib/utils";

const FILTERS: readonly ("All" | Platform)[] = ["All", "React Native", "React", "Flutter", "Native", "Node.js"];

/**
 * Everything I've built or worked on that's worth a look, with a platform
 * filter, because the person reading usually came for one platform in
 * particular. The filter only shows platforms that have at least one project.
 */
export function WorkIndex() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const available = FILTERS.filter((f) => f === "All" || work.some((w) => w.platforms.includes(f)));
  const shown = filter === "All" ? work : work.filter((w) => w.platforms.includes(filter));

  return (
    <Section
      id="work"
      title="Work"
      intro="Products I've built or worked on, most of them in fintech. Filter by platform if you came for one in particular."
    >
      <div role="group" aria-label="Filter by platform" className="flex flex-wrap gap-1.5">
        {available.map((f) => {
          const count = f === "All" ? work.length : work.filter((w) => w.platforms.includes(f)).length;
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[9px] border px-3 py-1.5 text-[0.875rem] font-medium transition-colors",
                on ? "border-ink bg-ink text-bg" : "border-line bg-surface text-dim shadow-card hover:border-line-strong hover:text-ink",
              )}
            >
              {f}
              <span className={cn("tabular-nums", on ? "text-bg/70" : "text-faint")}>{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {shown.map((item) => (
          <li key={item.id}>
            <Tray className="h-full">
              <Panel className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="heading text-[1.25rem] text-ink">{item.name}</h3>
                  <p className="text-[0.8125rem] tabular-nums text-faint">{item.period}</p>
                </div>
                <p className="mt-0.5 text-[0.875rem] text-faint">{item.org}</p>

                <p className="mt-4 text-[1rem] leading-relaxed text-ink">{item.what}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-dim">{item.body}</p>

                <BadgeList items={item.stack} className="mt-5" />

                {item.caseStudy || item.links?.length ? (
                  <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5">
                    {item.caseStudy ? (
                      <Link href={`/work/${item.caseStudy}`} className="link text-[0.9375rem] font-medium text-ink">
                        Read the case study
                      </Link>
                    ) : null}
                    {item.links?.map((link) => (
                      <ExternalLink key={link.href} href={link.href} className="text-[0.9375rem]">
                        {link.label}
                      </ExternalLink>
                    ))}
                  </div>
                ) : null}
              </Panel>
            </Tray>
          </li>
        ))}
      </ul>
    </Section>
  );
}
