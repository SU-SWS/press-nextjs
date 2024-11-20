import {NextRequest, NextResponse} from "next/server"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"

export const revalidate = false
export const dynamic = "force-static"
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

export const GET = async (_request: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  const bookId = (await params).id
  if (!bookId) notFound()
  return NextResponse.json(await getBookAncillaryContents(bookId))
}
