import {NextRequest, NextResponse} from "next/server"
import {graphqlClient} from "@lib/gql/gql-client"
import {cacheTag} from "next/cache"
import {isUuid} from "@lib/utils/request-guards"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 15

// Prices are commercially sensitive, so the CDN window is kept short. It still removes nearly every invocation for a
// popular book while capping how long a price change can be served stale.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=3600"

const getBookPrices = async (priceId: string) => {
  "use cache: remote"
  cacheTag("prices", `prices:${priceId}`)
  const prices = await graphqlClient().BookPrice({id: priceId})

  if (prices.press?.__typename === "PressPrice" && prices.press?.uuid) return prices.press
}

export const GET = async (_request: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  const priceId = (await params).id

  // Reject malformed ids before the lookup. Each distinct id is its own cache entry and its own Drupal query.
  if (!isUuid(priceId)) return NextResponse.json({message: "Invalid price id"}, {status: 400})

  const prices = await getBookPrices(priceId)
  if (!prices) return NextResponse.json({message: "Not found"}, {status: 404})

  return NextResponse.json(prices, {headers: {"Cache-Control": CACHE_CONTROL}})
}
