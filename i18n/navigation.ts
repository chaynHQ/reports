import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation primitives.
 *
 * Import `Link`, `redirect`, `usePathname`, and `useRouter` from this module
 * instead of `next/link` / `next/navigation` so that locale prefixes are
 * handled automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
