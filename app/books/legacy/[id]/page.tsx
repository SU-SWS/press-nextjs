import {notFound, redirect} from "next/navigation"
import {getAllLegacyPaths, getBookPathFromWorkId} from "../../getBookPathFromWorkId"

export const revalidate = false
export const dynamic = "force-static"

const LegacyBookPage = async ({params}: {params: {id: string}}) => {
  const legacyPaths = await getAllLegacyPaths()
  const legacyBook = legacyPaths.find(book => book.id === parseInt(params.id))
  if (legacyBook) redirect(legacyBook.path)

  const bookPath = /^\d+$/.test(params.id) && (await getBookPathFromWorkId(parseInt(params.id)))
  if (bookPath) redirect(bookPath)

  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  const params = await getAllLegacyPaths()
  return params.map(item => ({id: item.id.toString()}))
}

export default LegacyBookPage
