"use client";

/**
 * Next.js root-level error boundary.
 *
 * Rendered when the root layout itself crashes. RollbarProvider is unmounted
 * in this case, so useRollbar() is unavailable — Rollbar is instantiated
 * directly from clientConfig inside useEffect (browser-only, never during SSR).
 *
 * This file must render its own <html> and <body> tags.
 * This file must remain a client component — Next.js requires it.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 *
 * i18n note: strings are hardcoded in English here. When global-error renders,
 * the root layout — including NextIntlClientProvider — has crashed and there is
 * no i18n context to read from. This is a known Next.js constraint.
 */

import { clientConfig } from "@/lib/rollbar-config";
import { useEffect } from "react";
import Rollbar from "rollbar";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Instantiate a fresh Rollbar instance — the Provider-managed instance is
    // unavailable because the root layout (and its RollbarProvider) has crashed.
    const rollbar = new Rollbar(clientConfig);
    rollbar.error(error, { context: "global-error", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*
          Critical styles inlined to guarantee rendering if the CSS bundle is
          unavailable (e.g. network failure during a root layout crash).
        */}
        <style>{`
          .ge-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 9999px;
            padding: 10px 24px;
            background-color: #f0244d;
            color: #fffbf5;
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.15s;
          }
          .ge-btn:hover { opacity: 0.9; }
          .ge-btn:focus-visible {
            outline: 3px solid #f0244d;
            outline-offset: 3px;
          }
        `}</style>
      </head>
      <body
        style={{
          backgroundColor: "#fffbf5",
          color: "#1a1a1a",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main
          role="alert"
          aria-live="assertive"
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            padding: "96px 24px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
            A critical error occurred
          </h1>
          <button type="button" onClick={reset} className="ge-btn">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
