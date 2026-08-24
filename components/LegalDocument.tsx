import Link from "next/link";
import type { ReactNode } from "react";

export function LegalDocument({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="min-h-[calc(100svh-5rem)] border-t border-foreground/10 bg-background px-5 py-12 text-foreground sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-foreground/20 pb-10">
          <p className="text-xs font-semibold uppercase text-foreground/55">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-sm text-foreground/55">
            Effective and last updated {updated}
          </p>
        </header>

        <div className="legal-copy py-10">{children}</div>

        <footer className="flex flex-wrap gap-x-6 gap-y-3 border-t border-foreground/20 pt-8 text-sm font-semibold uppercase">
          <Link href="/">Home</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </footer>
      </div>
    </article>
  );
}

