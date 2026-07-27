import Link from "next/link";
import { Shell } from "@/components/primitives";

export default function NotFound() {
  return (
    <Shell className="flex min-h-[70vh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="display mt-6 max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] text-ink">
        This one doesn’t exist.
      </h1>
      <p className="measure mt-6 text-[1.0625rem] text-dim">
        Either it moved or it never did. Both are my fault.
      </p>
      <Link href="/" className="link mt-10 self-start text-[0.9375rem] text-ink">
        Back to the beginning
      </Link>
    </Shell>
  );
}
