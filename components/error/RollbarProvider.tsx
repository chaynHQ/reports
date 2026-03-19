"use client";

/**
 * Wraps @rollbar/react's Provider in a client component boundary so that
 * layout.tsx can remain a server component. Children are still rendered as
 * server components — wrapping RSC children in a client component does not
 * force them client-side.
 */

import { clientConfig } from "@/lib/rollbar-config";
import { Provider } from "@rollbar/react";
import type { ReactNode } from "react";

export function RollbarProvider({ children }: { children: ReactNode }) {
  return <Provider config={clientConfig}>{children}</Provider>;
}
