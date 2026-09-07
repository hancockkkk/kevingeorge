"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") {
    return <div className="redesign-page">{children}</div>;
  }
  return <><Header /><main>{children}</main></>;
}
