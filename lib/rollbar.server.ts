/**
 * Server-side Rollbar instance.
 *
 * Only import from server components, route handlers, or instrumentation.ts.
 * Do not import in a "use client" file — this would leak ROLLBAR_SERVER_TOKEN
 * into the client bundle.
 *
 * For client-side error reporting, use the @rollbar/react Provider and
 * useRollbar() hook instead. See components/error/RollbarProvider.tsx.
 */

import Rollbar from "rollbar";
import { GDPR_BASE_CONFIG, ROLLBAR_ENABLED } from "./rollbar-config";

const rollbarServer = new Rollbar({
  ...GDPR_BASE_CONFIG,
  accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  enabled: ROLLBAR_ENABLED && Boolean(process.env.ROLLBAR_SERVER_TOKEN),
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbarServer;
