import {notFound, redirect} from "next/navigation"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

export const revalidate = false
export const dynamic = "force-static"

const LegacyBookPage = async ({params}: {params: {id: string}}) => {
  const legacyPaths = await getLegacyBookPaths()
  const legacyBook = legacyPaths.find(book => book.id === parseInt(params.id))
  if (legacyBook) redirect(legacyBook.path + "/desk-examination-copy-requests")

  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  if (process.env.VERCEL_ENV === "preview") return []
  const params = await getLegacyBookPaths()
  return params.map(item => ({id: item.id.toString()}))
}

export default LegacyBookPage
