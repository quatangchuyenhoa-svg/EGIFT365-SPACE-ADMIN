/**
 * Server-side utility functions
 */

import { headers } from 'next/headers';

/**
 * Get cookie string from request headers
 * Use in Server Components and Server Actions
 *
 * @returns Cookie string or undefined
 *
 * @example
 * ```typescript
 * const cookie = await getCookieFromHeaders();
 * const result = await fetchServer('/api/endpoint', { method: 'GET', cookie });
 * ```
 */
export async function getCookieFromHeaders(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get('cookie') || undefined;
}

