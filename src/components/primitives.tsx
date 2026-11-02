import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1120px] px-5 sm:px-8", className)}>{children}</div>;
}

/**
 * A home-page section: a plain heading, an optional one-line intro, then the
 * content. No numbered rail and no label above the heading; the heading says
 * what the section is.
 */
export function Section({
  id,
  title,
  intro,
  aside,
  children,
  className,
}: {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Something small on the right of the heading row, like a filter or a link. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-24", className)}>
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="max-w-[44rem]">
            <h2 className="heading text-[1.75rem] leading-tight text-ink sm:text-[2.125rem]">{title}</h2>
            {intro ? <p className="mt-3 text-[1.0625rem] leading-relaxed text-dim">{intro}</p> : null}
          </div>
          {aside}
        </div>
        <div className="mt-10 sm:mt-12">{children}</div>
      </Shell>
    </section>
  );
}

/**
 * BoardUI's two-level card: a grey tray holding a white panel. The tray groups,
 * the panel holds the content. Radii step down a level, so the two never read
 * as the same box drawn twice.
 */
export function Tray({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-surface-2 p-1.5", className)}>{children}</div>;
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[12px] border border-line bg-surface shadow-card", className)}>{children}</div>
  );
}

/** A small stack or status chip. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "pindey";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[0.8125rem] font-medium leading-5",
        tone === "neutral" && "bg-surface-2 text-dim",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "pindey" && "bg-accent-2-soft text-accent-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BadgeList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Badge>{item}</Badge>
        </li>
      ))}
    </ul>
  );
}

const BUTTON = {
  base: "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-[0.9375rem] font-medium transition-colors",
  primary: "bg-ink text-bg hover:opacity-90",
  outline: "border border-line-strong bg-surface text-ink shadow-card hover:border-faint",
  quiet: "text-dim hover:bg-surface-2 hover:text-ink",
} as const;

export function buttonClass(variant: "primary" | "outline" | "quiet" = "outline", className?: string): string {
  return cn(BUTTON.base, BUTTON[variant], className);
}

export function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn("size-2.5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9L9 3M9 3H4.2M9 3v4.8" />
    </svg>
  );
}

/** An outbound link. The small arrow says "opens elsewhere", which is information, not decoration. */
export function ExternalLink({
  href,
  children,
  className,
  showArrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
}) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noreferrer noopener"}
      className={cn("inline-flex items-center gap-1.5 text-ink", className)}
    >
      <span className="link">{children}</span>
      {showArrow && !isMail ? <ArrowOut className="text-faint" /> : null}
    </a>
  );
}
