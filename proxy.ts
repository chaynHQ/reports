import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

/**
 * Next.js 16 Proxy (formerly `middleware.ts` — renamed in Next.js 16).
 *
 * next-intl handles:
 * - Locale detection from Accept-Language header and cookies
 * - Redirecting `/` → `/en` (or the user's preferred locale)
 * - Setting the NEXT_LOCALE cookie for subsequent requests
 *
 * The matcher excludes static assets, API routes, and Next.js internals
 * so they are never locale-prefixed.
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico   (browser favicon requests)
     * - Files with an extension (e.g. .svg, .png, .js, .css)
     * - api routes
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)',
  ],
};
