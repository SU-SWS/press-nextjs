import {notFound, redirect} from "next/navigation"
import {getBookPathFromWorkId} from "../getBookPathFromWorkId"

const LegacyBookExtraPage = async ({searchParams}: {searchParams?: {[_key: string]: string}}) => {
  if (!searchParams || !parseInt(searchParams.id)) notFound()
  const bookNodePath = await getBookPathFromWorkId(parseInt(searchParams.id))

  if (bookNodePath) redirect(`${bookNodePath}/excerpts`)
  notFound()
}

export default LegacyBookExtraPage
