"use client";

/**
 * Reusable error boundary wrapping @rollbar/react's ErrorBoundary.
 * Must be rendered inside RollbarProvider to report errors. Any use within
 * app/ satisfies this automatically since the Provider wraps the root layout.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeClientComponent />
 *   </ErrorBoundary>
 *
 *   // with a custom fallback that has a retry action:
 *   <ErrorBoundary fallback={({ resetError }) => (
 *     <button onClick={resetError}>Retry</button>
 *   )}>
 *     <SomeClientComponent />
 *   </ErrorBoundary>
 */
import { ErrorBoundary as RollbarErrorBoundary } from "@rollbar/react";
import { useTranslations } from "next-intl";
import type { ComponentType, ReactNode } from "react";

const fallbackStyles = "flex flex-col items-center gap-4 px-6 py-12 text-center";

/** Props passed to a custom fallback component by @rollbar/react. */
export interface FallbackProps {
  error: Error | null;
  resetError: () => void;
}

function DefaultFallback() {
  const t = useTranslations("error");
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={fallbackStyles}
    >
      {/* visually hidden heading gives screen reader users a landmark to navigate to. */}
      <h2 className="sr-only">{t("heading")}</h2>
      <p className="text-foreground/80">{t("refreshPrompt")}</p>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. Receives { error, resetError } props. */
  fallback?: ComponentType<FallbackProps>;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <RollbarErrorBoundary fallbackUI={fallback ?? DefaultFallback}>
      {children}
    </RollbarErrorBoundary>
  );
}
