import {notFound, redirect} from "next/navigation"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const LegacyBookPage = async ({params}: {params: {id: string}}) => {
  const legacyPaths = await getLegacyBookPaths()
  const legacyBook = legacyPaths.find(book => book.id === parseInt(params.id))
  if (legacyBook) redirect(legacyBook.path)

  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  const params = await getLegacyBookPaths()
  return params.map(item => ({id: item.id.toString()}))
}

export default LegacyBookPage
