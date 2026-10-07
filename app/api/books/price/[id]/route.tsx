import {connection, NextResponse} from "next/server"
import {graphqlClient} from "@lib/gql/gql-client"
import {cacheTag} from "next/cache"
import {isUuid} from "@lib/utils/request-guards"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 15

/**
 * With Cache Components, a GET handler that only reads params and cached data is prerendered and stored like a page.
 * The response carries this function's cache tags, so Drupal's `prices:<uuid>` revalidation replaces it as soon as a
 * price changes, and it stays cached until then instead of expiring on a fixed CDN window.
 */
const getBookPrices = async (priceId: string) => {
  "use cache: remote"
  cacheTag("prices", `prices:${priceId}`)
  const prices = await graphqlClient().BookPrice({id: priceId})

  if (prices.press?.__typename === "PressPrice" && prices.press?.uuid) return prices.press
}

// A placeholder so the handler is pre-rendered per id at request time instead of running dynamically for every call. It
// has to take a cacheable path: a placeholder that reaches `connection()` makes the whole route dynamic.
const PLACEHOLDER_ID = "00000000-0000-0000-0000-000000000000"
export const generateStaticParams = (): Array<{id: string}> => [{id: PLACEHOLDER_ID}]

export const GET = async (_request: Request, {params}: {params: Promise<{id: string}>}) => {
  const priceId = (await params).id

  // Malformed ids are answered dynamically so made up values don't each store a cached response.
  if (!isUuid(priceId)) {
    await connection()
    return NextResponse.json({message: "Invalid price id"}, {status: 400})
  }

  // Unknown ids are also answered dynamically, other than the build placeholder. Otherwise, requests for made up but
  // well-formed ids would each store a cached response. The data lookup is still cached, so Drupal is only queried once
  // per id, and Drupal's `prices:<uuid>` revalidation clears that entry if the price is created later.
  const prices = await getBookPrices(priceId)
  if (!prices) {
    if (priceId !== PLACEHOLDER_ID) await connection()
    return NextResponse.json({message: "Not found"}, {status: 404})
  }

  return NextResponse.json(prices)
}
