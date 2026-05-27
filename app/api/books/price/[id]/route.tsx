import {NextRequest, NextResponse} from "next/server"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {cacheTag} from "next/cache"

export const revalidate = false
export const dynamic = "force-static"
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

const getBookPrices = async (priceId: string) => {
  "use cache"
  cacheTag("prices", `prices:${priceId}`)
  const prices = await graphqlClient().BookPrice({id: priceId})

  if (prices.press?.__typename === "PressPrice" && prices.press?.uuid) return prices.press
}

export const GET = async (_request: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  const priceId = (await params).id
  const prices = await getBookPrices(priceId)

  if (prices) return NextResponse.json(prices)
  notFound()
}
