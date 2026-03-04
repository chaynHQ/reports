/**
 * Server-side Rollbar instance.
 *
 * IMPORT RESTRICTIONS:
 * - Only import from Server Components, Route Handlers, or instrumentation.ts.
 * - NEVER import in a "use client" file — doing so would leak ROLLBAR_SERVER_TOKEN
 *   into the client bundle.
 *
 * For client-side error reporting, use the @rollbar/react Provider and useRollbar()
 * hook instead. See components/RollbarProvider.tsx.
 */

import Rollbar from 'rollbar';
import { GDPR_BASE_CONFIG, ROLLBAR_ENABLED } from './rollbar-config';

const rollbarServer = new Rollbar({
  ...GDPR_BASE_CONFIG,
  accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  enabled: ROLLBAR_ENABLED && Boolean(process.env.ROLLBAR_SERVER_TOKEN),
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbarServer;
