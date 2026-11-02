"use client";

import { useState } from "react";
import { experience } from "@/content/experience";
import { BadgeList, Panel, Section, Tray } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * One line per role, so the whole arc is visible at once; the detail is one
 * click away. The newest role starts open.
 */
export function ExperienceLedger() {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <Section
      id="experience"
      title="Experience"
      intro="Five years across banking, lending, wallets, payments, health and e-commerce, in Lagos, Dubai, Riyadh and remote."
    >
      <Tray>
        <Panel className="divide-y divide-line">
          {experience.map((role) => {
            const open = openId === role.id;
            const panelId = `role-panel-${role.id}`;

            return (
              <div key={role.id}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : role.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-2/60 sm:grid-cols-[1.1fr_1fr_auto] sm:px-6"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-[1rem] font-semibold text-ink">
                        {role.company}
                        {role.current ? (
                          <span className="rounded-md bg-accent-2-soft px-1.5 py-px text-[0.75rem] font-medium text-accent-2">
                            Now
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[0.875rem] text-dim sm:hidden">{role.title}</span>
                    </span>

                    <span className="hidden text-[0.9375rem] text-dim sm:block">{role.title}</span>

                    <span className="flex items-center gap-4 text-[0.8125rem] tabular-nums text-faint">
                      <span className="whitespace-nowrap">
                        {role.start} to {role.end}
                      </span>
                      <svg
                        viewBox="0 0 12 12"
                        aria-hidden="true"
                        className={cn("size-3 transition-transform duration-200", open && "rotate-180")}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 4.5 6 7.5 9 4.5" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div id={panelId} hidden={!open} className="px-5 pb-6 sm:px-6">
                  <p className="text-[0.875rem] text-faint">
                    {role.employment}, {role.location}
                    {role.product ? `. ${role.product}` : ""}
                  </p>
                  <p className="measure mt-3 text-[1rem] leading-relaxed text-ink">{role.summary}</p>
                  <ul className="measure mt-4 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-dim marker:text-line-strong">
                    {role.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <BadgeList items={role.stack} className="mt-5" />
                </div>
              </div>
            );
          })}
        </Panel>
      </Tray>
    </Section>
  );
}
