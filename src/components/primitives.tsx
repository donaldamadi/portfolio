import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1180px] px-6 sm:px-10", className)}>{children}</div>;
}

/**
 * Every section carries a number and a label in a left rail. It's a small thing,
 * but it makes a long single-page site navigable by eye and gives the layout a
 * spine that a stack of centred cards doesn't have.
 */
export function Section({
  id,
  index,
  label,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  index: string;
  label: string;
  title?: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-line py-20 sm:py-28", className)}>
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[9rem_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-baseline gap-3 lg:block" data-reveal>
              <span className="rail-index">{index}</span>
              <span className="eyebrow block lg:mt-2">{label}</span>
            </div>
          </div>

          <div className="min-w-0">
            {title ? (
              <h2 className="display text-[clamp(2rem,4.4vw,3.25rem)] text-ink" data-reveal>
                {title}
              </h2>
            ) : null}
            {lede ? (
              <div className="measure mt-6 text-[1.0625rem] leading-relaxed text-dim" data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
                {lede}
              </div>
            ) : null}
            <div className={cn(title || lede ? "mt-12 sm:mt-16" : undefined)}>{children}</div>
          </div>
        </div>
      </Shell>
    </section>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-dim">
      {children}
    </span>
  );
}

export function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn("size-2.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5", className)}
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
      className={cn("group inline-flex items-center gap-1.5 link text-ink", className)}
    >
      {children}
      {showArrow ? <ArrowOut /> : null}
    </a>
  );
}
