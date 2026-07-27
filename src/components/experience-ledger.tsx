"use client";

import { useState } from "react";
import { experience } from "@/content/experience";
import { Section } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * A ledger, not a stack of cards. Roles collapse to one line each so the whole
 * six-year arc is visible at once; the detail is one click away rather than
 * three screens of scrolling.
 */
export function ExperienceLedger() {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <Section
      id="experience"
      index="02"
      label="Experience"
      title={
        <>
          Six years, mostly
          <br />
          where money moves.
        </>
      }
      lede={
        <p>
          Lagos, Dubai, Riyadh, remote. Retail banking, lending, wallets, card-present payments, mobility,
          healthcare, e-commerce. Every one of them taught me something about failure states I couldn’t have
          read.
        </p>
      }
    >
      <ul className="border-t border-line">
        {experience.map((role, index) => {
          const open = openId === role.id;
          const panelId = `role-panel-${role.id}`;

          return (
            <li key={role.id} className="border-b border-line" data-reveal style={{ ["--reveal-delay" as string]: `${Math.min(index, 6) * 45}ms` }}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : role.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-4 py-5 text-left sm:grid-cols-[1.2fr_1fr_auto] sm:gap-8"
                >
                  <span className="flex items-baseline gap-2.5">
                    <span
                      className={cn(
                        "mt-px size-1.5 shrink-0 rounded-full transition-colors",
                        role.current ? "bg-accent" : "bg-line-strong",
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-[1.0625rem] text-ink transition-colors group-hover:text-accent">
                      {role.company}
                    </span>
                  </span>

                  <span className="hidden text-[0.875rem] text-dim sm:block">{role.title}</span>

                  <span className="flex items-center gap-4 font-mono text-[0.6875rem] text-faint">
                    <span className="whitespace-nowrap">
                      {role.start} - {role.end}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn("transition-transform duration-300", open && "rotate-45")}
                    >
                      +
                    </span>
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                hidden={!open}
                className="grid gap-6 pb-8 sm:grid-cols-[1.2fr_1fr] sm:gap-10 sm:pl-4"
              >
                <div>
                  <p className="font-mono text-[0.6875rem] text-faint">
                    {role.title} · {role.employment} · {role.location}
                    {role.product ? ` · ${role.product}` : ""}
                  </p>
                  <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-dim">{role.summary}</p>
                  <ul className="mt-5 space-y-2.5">
                    {role.highlights.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-dim">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:pt-1">
                  <p className="eyebrow">Stack</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {role.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-dim"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
