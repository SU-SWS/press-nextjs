import {notFound, redirect} from "next/navigation"
import {getBookFromWorkId} from "../getBookFromWorkId"

const LegacyBookPage = async ({searchParams}: {searchParams?: {[_key: string]: string}}) => {
  if (!searchParams || !searchParams.id) notFound()
  const bookNode = await getBookFromWorkId(parseInt(searchParams.id))

  if (bookNode) redirect(bookNode.path)
  notFound()
}

export default LegacyBookPage
