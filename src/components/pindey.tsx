"use client";

import { useRef, useState } from "react";
import { pindey } from "@/content/pindey";
import { FinderDemo } from "./finder-demo";
import { BadgeList, Panel, Section, Tray, buttonClass } from "./primitives";
import { cn } from "@/lib/utils";
import { unlock } from "@/lib/achievements";

type SurfaceId = (typeof pindey.surfaces)[number]["id"];

/**
 * PinDey as the whole system it is: four surfaces behind one segmented
 * control. The app tab carries the working Finder and the decision worth the
 * most room; the others carry a small picture of what that surface does.
 *
 * House rule: PinDey is never described with "track" or any form of it.
 */
export function PinDey() {
  const [active, setActive] = useState<SurfaceId>("app");
  const seen = useRef(new Set<SurfaceId>(["app"]));

  const choose = (id: SurfaceId) => {
    setActive(id);
    seen.current.add(id);
    if (seen.current.size === pindey.surfaces.length) unlock("pindey-tour");
  };
  const surface = pindey.surfaces.find((s) => s.id === active) ?? pindey.surfaces[0];

  return (
    <Section
      id="pindey"
      title="PinDey, built end to end"
      intro={
        <>
          {pindey.oneLiner} <span className="italic text-accent-2">&ldquo;{pindey.tagline}&rdquo;</span> Live at{" "}
          <a href={pindey.links.site.href} target="_blank" rel="noreferrer noopener" className="link text-ink">
            pindey.app
          </a>
          , and every layer of it is mine.
        </>
      }
      aside={
        <div className="flex flex-wrap gap-2">
          <a href={pindey.links.demo.href} target="_blank" rel="noreferrer noopener" className={buttonClass("primary")}>
            Try the walkthrough
          </a>
          <a href={pindey.links.site.href} target="_blank" rel="noreferrer noopener" className={buttonClass("outline")}>
            pindey.app
          </a>
        </div>
      }
    >
      <div
        role="tablist"
        aria-label="PinDey surfaces"
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-[12px] bg-surface-2 p-1"
      >
        {pindey.surfaces.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={on}
              aria-controls={`panel-${s.id}`}
              onClick={() => choose(s.id)}
              className={cn(
                "whitespace-nowrap rounded-[9px] px-3.5 py-1.5 text-[0.9375rem] font-medium transition-colors",
                on ? "bg-surface text-ink shadow-card" : "text-dim hover:text-ink",
              )}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${surface.id}`} aria-labelledby={`tab-${surface.id}`} className="mt-5">
        <Tray>
          <Panel className="p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <p className="measure text-[1.0625rem] leading-relaxed text-dim">{surface.summary}</p>
              <BadgeList items={surface.stack} className="lg:max-w-[22rem] lg:justify-end" />
            </div>

            <div className="mt-7">
              {surface.id === "app" ? <AppSurface /> : null}
              {surface.id === "web" ? <WebSurface /> : null}
              {surface.id === "admin" ? <AdminSurface /> : null}
              {surface.id === "api" ? <ApiSurface /> : null}
            </div>
          </Panel>
        </Tray>
      </div>

      <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-faint">{pindey.monorepo}</p>
    </Section>
  );
}

function AppSurface() {
  return (
    <div>
      <p className="mb-5 text-[1.0625rem] leading-relaxed text-ink">
        {pindey.problem[0]} {pindey.problem[1]} <span className="text-dim">{pindey.problem[2]}</span>
      </p>
      <FinderDemo />
      <div className="mt-6 grid gap-6 border-t border-line pt-6 md:grid-cols-[1.4fr_1fr] md:gap-10">
        <div>
          <h3 className="heading text-[1.25rem] text-ink">{pindey.finder.honest.title}</h3>
          <div className="mt-2 space-y-2 text-[1rem] leading-relaxed text-dim">
            {pindey.finder.honest.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <ul className="space-y-2.5 text-[0.9375rem] text-dim">
          {pindey.privacy.map((item) => (
            <li key={item.big}>
              <span className="font-semibold text-ink">{item.big}</span> {item.small}
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {pindey.features.map((feature) => (
          <div key={feature.id}>
            <dt className="text-[0.9375rem] font-semibold text-ink">{feature.name}</dt>
            <dd className="mt-0.5 text-[0.9375rem] leading-relaxed text-dim">{feature.body}</dd>
          </div>
        ))}
      </dl>
      <BadgeList items={pindey.extras} className="mt-6" />
    </div>
  );
}

/** The no-install meet-point tool, as it looks in a browser. */
function WebSurface() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[12px] border border-line bg-surface-2">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 truncate rounded-md bg-surface-2 px-2.5 py-0.5 text-[0.75rem] text-faint">
          pindey.app/&hellip;#lat,lng
        </span>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1fr] sm:p-7">
        <div>
          <p className="text-[1.125rem] font-semibold text-ink">Meet here</p>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-dim">
            Drop a meet point in the browser, no app needed, and share the link so everyone knows where to gather.
          </p>
          <p className="mt-4 inline-flex rounded-lg bg-accent-2-soft px-3 py-1.5 text-[0.8125rem] font-medium text-accent-2">
            The location stays in the link. The server never sees it.
          </p>
        </div>
        <div className="relative grid min-h-[150px] place-items-center rounded-[10px] border border-line bg-surface">
          <span className="ripple absolute size-24 rounded-full border-2 border-accent-2" />
          <span className="relative size-4 rounded-full border-2 border-surface bg-accent-2 shadow-panel" />
        </div>
      </div>
    </div>
  );
}

function AdminSurface() {
  const reports = [
    { what: "Spam invites in a Space", who: "Reported by 3 people", state: "Open" },
    { what: "Display name check", who: "Auto-flagged", state: "Reviewing" },
    { what: "Duplicate account", who: "Reported by 1 person", state: "Resolved" },
  ];
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[12px] border border-line">
      <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
        <p className="text-[0.875rem] font-semibold text-ink">Reports</p>
        <p className="text-[0.75rem] text-faint">Every action lands in the audit log</p>
      </div>
      <table className="w-full text-left text-[0.875rem]">
        <tbody>
          {reports.map((r) => (
            <tr key={r.what} className="border-b border-line last:border-0">
              <td className="px-4 py-3 text-ink">{r.what}</td>
              <td className="hidden px-4 py-3 text-faint sm:table-cell">{r.who}</td>
              <td className="px-4 py-3 text-right">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[0.75rem] font-medium",
                    r.state === "Resolved" ? "bg-accent-2-soft text-accent-2" : r.state === "Open" ? "bg-accent-soft text-accent" : "bg-surface-2 text-dim",
                  )}
                >
                  {r.state}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The write path: why a crash between saving and publishing can't lose an update. */
function ApiSurface() {
  const steps = [
    { name: "Phone or browser", note: "Sends a write with an idempotency key" },
    { name: "API", note: "Saves the change and its event in one transaction" },
    { name: "Outbox relay", note: "Publishes, counting attempts and keeping the last error" },
    { name: "Gateway and worker", note: "WebSocket presence, BullMQ push" },
  ];
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.name} className="relative rounded-[10px] border border-line bg-surface-2 p-4">
          <p className="rail-index">{i + 1}</p>
          <p className="mt-1 text-[0.9375rem] font-semibold text-ink">{step.name}</p>
          <p className="mt-1 text-[0.875rem] leading-snug text-dim">{step.note}</p>
          {i < steps.length - 1 ? (
            <span aria-hidden="true" className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-faint md:block">
              &rsaquo;
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
