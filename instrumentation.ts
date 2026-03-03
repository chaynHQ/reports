/**
 * Next.js Instrumentation Hook.
 *
 * Called once when a new server instance starts. Used here to initialise
 * the server-side Rollbar instance and confirm it is active.
 *
 * The NEXT_RUNTIME guard ensures the import only runs on Node.js — not on
 * the Edge runtime, which does not support the full Rollbar Node.js SDK.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { default: rollbarServer } = await import('./lib/rollbar.server');

    if (rollbarServer.options.enabled) {
      rollbarServer.log('Rollbar server-side instrumentation initialised.');
    }
  }
}
