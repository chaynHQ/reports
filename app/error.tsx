'use client';

/**
 * Next.js route-segment error boundary.
 *
 * Rendered automatically when an unhandled error occurs within a route segment.
 * The root layout (and therefore the RollbarProvider) remains mounted when this
 * renders, so useRollbar() is safe to use here.
 *
 * This file MUST remain a Client Component — Next.js requires it.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

// TODO (A11y): Test this error state with VoiceOver (macOS/iOS) and NVDA (Windows).
// Confirm role="alert" announces without requiring user focus shift.
// The reset button must be reachable via keyboard (Tab) and activated via Enter/Space.

import { useEffect } from 'react';
import { useRollbar } from '@rollbar/react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const rollbar = useRollbar();

  useEffect(() => {
    rollbar.error(error, {
      // digest is a stable, anonymised server-side hash — safe to log.
      digest: error.digest,
    });
  }, [error, rollbar]);

  return (
    <main role="alert" aria-live="assertive">
      <h2>Something went wrong</h2>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
