import { site } from './site'
import type { SiteContent } from './types'

export * from './types'

/**
 * The single read point for page content.
 *
 * Today it resolves the local `site.ts` record. When La Toscana moves onto a
 * CMS, this is the only function that changes — swap the body for the fetch and
 * map the response onto `SiteContent`. It is already async and called from
 * Server Components, so nothing downstream has to move:
 *
 *   export async function getSiteContent(): Promise<SiteContent> {
 *     const res = await fetch(`${process.env.CMS_URL}/homepage`, {
 *       next: { revalidate: 300 },
 *     })
 *     return toSiteContent(await res.json())
 *   }
 */
export async function getSiteContent(): Promise<SiteContent> {
  return site
}
