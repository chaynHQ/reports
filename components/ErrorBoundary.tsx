'use client';

/**
 * Reusable Error Boundary.
 *
 * A thin wrapper over @rollbar/react's ErrorBoundary that:
 *  - provides a WCAG-compliant default fallback component
 *  - enforces a consistent, typed prop API across the app
 *
 * Must be rendered inside <RollbarProvider> to report errors. Since the Provider
 * wraps all children in app/[locale]/layout.tsx, any use within app/ satisfies
 * this automatically.
 *
 * @rollbar/react's ErrorBoundary is a class component internally — it reads the
 * Rollbar instance from RollbarContext, so we do not need to manage that ourselves.
 *
 * Usage (static fallback):
 *   <ErrorBoundary fallback={() => <p>Could not load this section.</p>}>
 *     <SomeClientComponent />
 *   </ErrorBoundary>
 *
 * Usage (fallback with reset action):
 *   <ErrorBoundary fallback={({ resetError }) => (
 *     <button onClick={resetError}>Retry</button>
 *   )}>
 *     <SomeClientComponent />
 *   </ErrorBoundary>
 */

// TODO (A11y): The default fallback uses role="alert" and aria-live="assertive".
// If you supply a custom fallback component, ensure it also includes an appropriate
// ARIA live region and that interactive elements are keyboard-accessible.

import { useTranslations } from 'next-intl';
import { ErrorBoundary as RollbarErrorBoundary } from '@rollbar/react';
import type { ComponentType, ReactNode } from 'react';

/** Props passed to a custom fallback component by @rollbar/react. */
export interface FallbackProps {
  error: Error | null;
  resetError: () => void;
}

// TODO (A11y): Test DefaultFallback announcement with NVDA (Windows), JAWS, and
// VoiceOver (macOS/iOS). Confirm the live region fires without requiring focus.
function DefaultFallback() {
  const t = useTranslations('error');
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center gap-4 px-6 py-12 text-center"
    >
      <p className="text-foreground/60">{t('refreshPrompt')}</p>
    </div>
  );
}

interface Props {
  children: ReactNode;
  /** Optional custom fallback component. Receives { error, resetError } props. */
  fallback?: ComponentType<FallbackProps>;
}

export default function ErrorBoundary({ children, fallback }: Props) {
  return (
    <RollbarErrorBoundary fallbackUI={fallback ?? DefaultFallback}>
      {children}
    </RollbarErrorBoundary>
  );
}
