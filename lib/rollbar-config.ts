/**
 * Rollbar configuration shared by server and client instances.
 *
 * Exports:
 *  - GDPR_BASE_CONFIG — shared base settings (no token, no runtime flags)
 *  - clientConfig     — full client config for the @rollbar/react Provider
 *                       and for global-error.tsx (which instantiates Rollbar directly)
 *
 * These settings disable IP capture, user identity tracking, and browser
 * fingerprinting to meet EU/UK GDPR requirements. Loosening them requires
 * a DPIA under GDPR Article 35 before deployment.
 *
 * Session replay is intentionally omitted — recording user interactions is
 * incompatible with this project's GDPR obligations.
 */

import type Rollbar from "rollbar";

export const ROLLBAR_ENV = process.env.NODE_ENV ?? "development";

/** Rollbar only transmits in production to prevent noise and unnecessary data processing. */
export const ROLLBAR_ENABLED = process.env.NODE_ENV === "production";

/**
 * Fields scrubbed (redacted to "********") from every outgoing payload.
 * Extends Rollbar's built-in defaults with additional PII / network identifiers.
 */
export const SCRUB_FIELDS = [
  // Rollbar defaults — kept explicit for security audit visibility
  "passwd",
  "password",
  "secret",
  "confirm_password",
  "password_confirmation",
  "auth_token",
  "authentication_token",
  "secret_token",
  // Additional PII / network identifiers
  "email",
  "ip",
  "user_ip",
  "request_ip",
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "authorization",
  "cookie",
  "set-cookie",
] as const;

/**
 * GDPR-compliant settings shared by both server and client Rollbar instances.
 * Does not include an access token or runtime-specific flags.
 */
export const GDPR_BASE_CONFIG = {
  environment: ROLLBAR_ENV,
  // GDPR: disable all IP address collection.
  captureIp: false,
  // GDPR: scrub PII fields from every payload before transmission.
  scrubFields: SCRUB_FIELDS as unknown as string[],
  // GDPR: strip any person / user identity accidentally attached to a payload.
  transform(data: object): void {
    const payload = data as Record<string, unknown>;
    delete payload["person"];
    delete payload["user"];
  },
} satisfies Partial<Rollbar.Configuration>;

/**
 * Full GDPR-compliant client-side Rollbar configuration.
 *
 * Consumed by:
 *  - components/error/RollbarProvider.tsx  (passed to the @rollbar/react Provider)
 *  - app/global-error.tsx                  (instantiates Rollbar directly when the
 *                                           root layout has crashed)
 *
 * Do not import this from lib/rollbar.server.ts or any server-only file —
 * it references NEXT_PUBLIC_ vars and belongs in the client bundle only.
 */
export const clientConfig: Rollbar.Configuration = {
  ...GDPR_BASE_CONFIG,
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  enabled:
    ROLLBAR_ENABLED && Boolean(process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN),
  captureUncaught: true,
  captureUnhandledRejections: true,
  // GDPR: restrict browser auto-instrumentation to prevent user fingerprinting.
  autoInstrument: {
    // network errors are kept; scrubFields handles sensitive query parameters.
    network: true,
    networkResponseBody: false,
    networkRequestBody: false,
    // console output may contain user data.
    log: false,
    // click/interaction patterns can fingerprint users.
    dom: false,
    // automatic page-navigation tracking disabled.
    navigation: false,
    connectivity: false,
  },
};
