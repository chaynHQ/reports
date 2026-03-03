/**
 * Rollbar configuration.
 *
 * Two exports:
 *  - GDPR_BASE_CONFIG  — shared settings for server + client (no token, no runtime flags).
 *  - clientConfig      — full client config passed to the @rollbar/react Provider
 *                        and used directly in global-error.tsx.
 *
 * GDPR / UK GDPR COMPLIANCE — DO NOT WEAKEN:
 * These settings explicitly disable IP address capture, user identity tracking,
 * and browser fingerprinting. Any modification that re-enables personal data
 * collection requires a Data Protection Impact Assessment (DPIA) under
 * UK GDPR Article 35 before deployment.
 *
 * SESSION REPLAY: deliberately omitted — recording user interactions is
 * incompatible with this project's GDPR obligations.
 */

import type Rollbar from 'rollbar';

export const ROLLBAR_ENV = process.env.NODE_ENV ?? 'development';

/** Rollbar only transmits events in production to prevent noise and unnecessary data processing. */
export const ROLLBAR_ENABLED = process.env.NODE_ENV === 'production';

/**
 * Fields scrubbed (redacted to "********") from every outgoing payload.
 * Extends Rollbar's built-in defaults with additional PII / network identifiers.
 */
export const SCRUB_FIELDS = [
  // Rollbar defaults — kept explicit for security audit visibility
  'passwd',
  'password',
  'secret',
  'confirm_password',
  'password_confirmation',
  'auth_token',
  'authentication_token',
  'secret_token',
  // Additional PII / network identifiers
  'email',
  'ip',
  'user_ip',
  'request_ip',
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
  'authorization',
  'cookie',
  'set-cookie',
] as const;

/**
 * GDPR-compliant settings shared by both the server and client Rollbar instances.
 * Does not include an access token or runtime-specific flags.
 */
export const GDPR_BASE_CONFIG = {
  environment: ROLLBAR_ENV,
  // GDPR: Disable all IP address collection.
  captureIp: false,
  // GDPR: Scrub PII fields from every payload before transmission.
  scrubFields: SCRUB_FIELDS as unknown as string[],
  // GDPR: Strip any person / user identity that may have been accidentally attached.
  transform(data: object): void {
    const payload = data as Record<string, unknown>;
    delete payload['person'];
    delete payload['user'];
  },
} satisfies Partial<Rollbar.Configuration>;

/**
 * Full GDPR-compliant client-side Rollbar configuration.
 *
 * Consumed by:
 *  - components/RollbarProvider.tsx  (passed to the @rollbar/react <Provider>)
 *  - app/global-error.tsx            (instantiates Rollbar directly; Provider is unavailable
 *                                     when the root layout itself has crashed)
 *
 * NEVER import this into lib/rollbar.server.ts or any server-only file —
 * it references NEXT_PUBLIC_ vars and belongs in the client bundle only.
 */
export const clientConfig: Rollbar.Configuration = {
  ...GDPR_BASE_CONFIG,
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  enabled: ROLLBAR_ENABLED && Boolean(process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN),
  captureUncaught: true,
  captureUnhandledRejections: true,
  // GDPR: Restrict browser auto-instrumentation to prevent user fingerprinting.
  autoInstrument: {
    // Keep network error capture; scrubFields handles sensitive query parameters.
    network: true,
    networkResponseBody: false,
    networkRequestBody: false,
    // GDPR: Disable console capture — output may contain user data.
    log: false,
    // GDPR: Disable DOM event capture — click/interaction patterns can fingerprint users.
    dom: false,
    // GDPR: Disable automatic page-navigation tracking.
    navigation: false,
    connectivity: false,
  },
};
