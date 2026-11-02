import { profile } from "@/content/profile";
import { pindey } from "@/content/pindey";
import { HeroFinder } from "./hero-finder";
import { Shell, Tray, buttonClass } from "./primitives";

const github = profile.links.find((link) => link.label === "GitHub")?.href ?? "";

/** Where the mobile work shipped. Plain names, no logo wall. */
const SHIPPED_FOR = ["First Bank of Nigeria", "Zedcrest", "MedPal", "SnapPay", "Equivator", "Creative Advanced Technologies"];

export function Hero() {
  const { hero } = profile;

  return (
    <section className="pb-16 pt-28 sm:pb-24 sm:pt-36">
      <Shell>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[0.9375rem] text-dim">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-2 opacity-60" style={{ animationDuration: "2.4s" }} />
                <span className="relative inline-flex size-2 rounded-full bg-accent-2" />
              </span>
              {profile.shortName}, {profile.role.toLowerCase()} in {profile.location.split(",")[0]}
            </p>

            <h1 className="display mt-6 text-[clamp(2.25rem,4.6vw,3.25rem)] text-ink">{hero.title}</h1>

            <p className="measure mt-6 text-[1.125rem] leading-relaxed text-dim">{hero.intro}</p>
            <p className="mt-4 text-[1rem] text-ink">
              Building{" "}
              <a href={pindey.links.site.href} target="_blank" rel="noreferrer noopener" className="link font-medium text-accent-2">
                PinDey
              </a>
              . {hero.status}
            </p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <a href={`mailto:${profile.email}`} className={buttonClass("primary")}>
                Email me
              </a>
              <a href="/Donald-Amadi-CV.pdf" target="_blank" rel="noreferrer" className={buttonClass("outline")}>
                Download CV
              </a>
              <a href={github} target="_blank" rel="noreferrer noopener" className={buttonClass("quiet")}>
                GitHub
              </a>
            </div>

            <p className="mt-12 text-[0.875rem] leading-relaxed text-faint">
              Mobile work shipped for {SHIPPED_FOR.slice(0, -1).join(", ")} and {SHIPPED_FOR.at(-1)}.
            </p>
          </div>

          <ProductShot />
        </div>
      </Shell>
    </section>
  );
}

/**
 * A still of PinDey: the Next.js back office in a browser window, with the
 * Flutter app's Finder in front of it. It says "web and mobile, one product"
 * faster than a sentence can. Decorative, so it's hidden from screen readers;
 * the caption carries the meaning.
 */
function ProductShot() {
  const rows = [
    { name: "Owambe at Ikoyi", code: "HSE-234", people: 46, state: "Live" },
    { name: "Lekki market run", code: "MKT-118", people: 9, state: "Live" },
    { name: "Campus tour", code: "UNI-507", people: 23, state: "Ended" },
    { name: "Sunday service", code: "CHR-311", people: 61, state: "Live" },
  ];

  return (
    <figure className="min-w-0">
      <div className="relative pb-10 pr-6 sm:pr-14" aria-hidden="true">
        <Tray>
          <div className="overflow-hidden rounded-[12px] border border-line bg-surface shadow-panel">
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 truncate rounded-md bg-surface-2 px-2.5 py-0.5 text-[0.75rem] text-faint">admin / spaces</span>
            </div>
            <div className="flex">
              <div className="hidden w-32 shrink-0 space-y-1 border-r border-line p-2.5 text-[0.75rem] sm:block">
                {["Overview", "Spaces", "Reports", "Testers", "Remote config", "Audit log"].map((item) => (
                  <p
                    key={item}
                    className={item === "Spaces" ? "rounded-md bg-surface-2 px-2 py-1 font-medium text-ink" : "px-2 py-1 text-faint"}
                  >
                    {item}
                  </p>
                ))}
              </div>
              <div className="min-w-0 flex-1 p-3">
                <p className="text-[0.8125rem] font-semibold text-ink">Spaces</p>
                <table className="mt-2 w-full text-left text-[0.75rem]">
                  <thead>
                    <tr className="text-faint">
                      <th className="py-1.5 font-medium">Name</th>
                      <th className="py-1.5 font-medium">Code</th>
                      <th className="py-1.5 text-right font-medium">People</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.code} className="border-t border-line">
                        <td className="truncate py-2 pr-2 text-ink">{row.name}</td>
                        <td className="py-2 pr-2 font-mono text-dim">{row.code}</td>
                        <td className="py-2 text-right tabular-nums text-dim">{row.people}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Tray>

        {/* The phone, in front */}
        <div className="absolute -bottom-2 right-0 w-[150px] rounded-[28px] border border-line-strong bg-surface p-2 shadow-float sm:w-[184px]">
          <div className="rounded-[22px] bg-surface-2 px-3 pb-4 pt-3">
            <span className="mx-auto block h-1 w-10 rounded-full bg-line-strong" />
            <HeroFinder />
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[0.875rem] text-faint">
        Illustration of PinDey, one of my products: the Next.js back office and the Flutter app.
      </figcaption>
    </figure>
  );
}
