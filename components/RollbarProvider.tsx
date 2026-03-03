'use client';

/**
 * Rollbar context provider.
 *
 * Wraps @rollbar/react's <Provider> in a Client Component boundary so that
 * app/layout.tsx can remain a React Server Component. The provider supplies
 * a single Rollbar instance to the entire client component tree via React Context.
 *
 * Children passed through this component are still rendered as Server Components —
 * wrapping RSC children in a Client Component does not client-render them.
 *
 * Do NOT add "use client" to app/layout.tsx to accommodate this component;
 * that would negate the RSC architecture entirely.
 */

import { Provider } from '@rollbar/react';
import { clientConfig } from '@/lib/rollbar-config';
import type { ReactNode } from 'react';

export default function RollbarProvider({ children }: { children: ReactNode }) {
  return <Provider config={clientConfig}>{children}</Provider>;
}
