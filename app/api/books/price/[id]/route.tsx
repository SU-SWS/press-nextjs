import {NextRequest, NextResponse} from "next/server"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"

export const revalidate = false
export const dynamic = "force-static"
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

export const GET = async (_request: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  const priceId = (await params).id
  const prices = await graphqlClient({next: {tags: ["all-prices", `prices:${priceId}`]}}).BookPrice({id: priceId})

  if (prices.press?.__typename === "PressPrice" && prices.press?.id) return NextResponse.json(prices.press)
  notFound()
}
