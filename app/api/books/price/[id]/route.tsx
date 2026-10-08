import {NextResponse} from "next/server"
import {graphqlClient} from "@lib/gql/gql-client"
import {BookPriceDocument, BookPriceQuery} from "@lib/gql/__generated__/graphql"
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
  const prices = await graphqlClient().request<BookPriceQuery>(BookPriceDocument, {id: priceId})

  if (prices.press?.__typename === "PressPrice" && prices.press?.uuid) return prices.press
}

// A placeholder so the handler is prerendered per id at request time instead of running dynamically for every call.
// Every runtime request goes through that prerender, so the handler can't use dynamic APIs like `connection()`: route
// handlers have no dynamic fallback, and the request fails with a 500.
const PLACEHOLDER_ID = "00000000-0000-0000-0000-000000000000"
export const generateStaticParams = (): Array<{id: string}> => [{id: PLACEHOLDER_ID}]

export const GET = async (_request: Request, {params}: {params: Promise<{id: string}>}) => {
  const priceId = (await params).id

  // Malformed ids are rejected before the Drupal lookup. Like unknown ids below, the response is stored per id.
  if (!isUuid(priceId)) return NextResponse.json({message: "Invalid price id"}, {status: 400})

  // Unknown ids store a cached 404, the same as the data lookup already caches per id. It carries the `prices:<uuid>`
  // tag from the lookup, so Drupal's revalidation replaces it if the price is created later.
  const prices = await getBookPrices(priceId)
  if (!prices) return NextResponse.json({message: "Not found"}, {status: 404})

  return NextResponse.json(prices)
}
