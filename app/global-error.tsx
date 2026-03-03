'use client';

/**
 * Next.js root-level error boundary.
 *
 * Rendered when the root layout itself crashes. Because the root layout is gone,
 * the RollbarProvider is also unmounted — useRollbar() is NOT available here.
 * Instead, we instantiate Rollbar directly from clientConfig inside useEffect
 * (browser-only, never during SSR).
 *
 * This file must render its own <html> and <body> tags.
 * This file MUST remain a Client Component — Next.js requires it.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 */

// TODO (A11y): This component renders without the main layout, so no skip-link,
// theme, or font context is present. Ensure the fallback UI independently meets
// WCAG 2.1 AA contrast ratios and that the "Try again" button has a visible
// keyboard focus indicator.

import { useEffect } from 'react';
import Rollbar from 'rollbar';
import { clientConfig } from '@/lib/rollbar-config';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Instantiate a fresh Rollbar instance — the Provider-managed instance is
    // unavailable because the root layout (and its RollbarProvider) has crashed.
    const rollbar = new Rollbar(clientConfig);
    rollbar.error(error, { context: 'global-error', digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* TODO (A11y): Verify role="alert" is announced by screen readers in this
            context — the absence of a skip-link may affect navigation for keyboard users. */}
        <main role="alert" aria-live="assertive">
          <h1>A critical error occurred</h1>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
