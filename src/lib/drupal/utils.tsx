import {stringify} from "qs"
import {TermUnion, MenuItem} from "@lib/gql/__generated__/drupal.d"

export const buildUrl = (path: string, params?: string | Record<string, string> | URLSearchParams): URL => {
  const url = new URL(path.charAt(0) === "/" ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${path}` : path)

  // Use instead URLSearchParams for nested params.
  if (params) url.search = stringify(params)
  return url
}

export const buildHeaders = (headers?: HeadersInit, isPreviewMode?: boolean): Headers => {
  const requestHeaders = new Headers(headers)

  if (process.env.DRUPAL_REQUEST_HEADERS) {
    const envRequestHeaders: Record<string, string> = JSON.parse(process.env.DRUPAL_REQUEST_HEADERS)
    Object.keys(envRequestHeaders).map(key => {
      requestHeaders.set(key, envRequestHeaders[key])
    })
  }

  const authCreds = (
    isPreviewMode ? process.env.DRUPAL_BASIC_AUTH_ADMIN || process.env.DRUPAL_BASIC_AUTH : process.env.DRUPAL_BASIC_AUTH
  ) as string

  requestHeaders.set("Authorization", "Basic " + Buffer.from(authCreds).toString("base64"))
  return requestHeaders
}

export type Slug = {slug: string[]}

export type PageProps = {
  params: Promise<Slug>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export const getPathFromContext = (slug: string | string[], prefix = ""): string => {
  let slugString = Array.isArray(slug) ? slug.map(s => encodeURIComponent(s)).join("/") : slug
  slugString = slugString.replace(/^\//, "")
  return prefix ? `${prefix}/${slugString}` : `/${slugString}`
}

export type TermTree<T extends TermUnion> = T & {
  below?: TermTree<T>[]
}

export const getTaxonomyTree = <T extends TermUnion>(terms: T[]): TermTree<T>[] => {
  const {below} = buildTaxonomyTree<T>(terms)
  return below || terms
}

export const buildTaxonomyTree = <T extends TermUnion>(terms: T[], parent: T["id"] = ""): {below?: T[]} => {
  if (!terms?.length) return {below: []}

  const children = terms.filter(term => parent && term.parent?.id === parent)

  return children.length
    ? {
        below: children.map(link => ({
          ...link,
          ...buildTaxonomyTree(terms, link.id),
        })),
      }
    : {}
}

/**
 * Get an array of menu item ids representing the current page"s location in the main menu.
 *
 * @param menuItems
 *   Array of menu items.
 * @param currentPath
 *   Current page url.
 */
const getActiveTrail = (menuItems: MenuItem[], currentPath?: string) => {
  const getActiveTrailInternal = (menuItems: MenuItem[], trail: string[] = []): string[] => {
    let childTrail, currentTrail
    for (let i = 0; i < menuItems.length; i++) {
      currentTrail = [...trail]
      currentTrail.push(menuItems[i].id)

      if (currentPath === menuItems[i].url) {
        return currentTrail
      }

      const childrenItems = menuItems[i].children

      if (childrenItems) {
        childTrail = getActiveTrailInternal(childrenItems, [...currentTrail])
        if (childTrail.length > 0) {
          return childTrail
        }
      }
    }
    return []
  }

  return getActiveTrailInternal(menuItems)
}

export default getActiveTrail
