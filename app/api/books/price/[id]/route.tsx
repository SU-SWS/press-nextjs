import {NextRequest, NextResponse} from "next/server"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {cacheTag} from "next/cache"
import {INFINITE_CACHE} from "next/dist/lib/constants"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

const getBookPrices = async (priceId: string) => {
  "use cache: remote"
  const tags = ["prices", `prices:${priceId}`]
  cacheTag(...tags)
  const prices = await graphqlClient({next: {revalidate: INFINITE_CACHE, tags}}).BookPrice({id: priceId})

  if (prices.press?.__typename === "PressPrice" && prices.press?.uuid) return prices.press
}

export const GET = async (_request: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  const priceId = (await params).id
  const prices = await getBookPrices(priceId)

  if (prices) return NextResponse.json(prices)
  notFound()
}
