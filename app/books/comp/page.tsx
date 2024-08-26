import {notFound, redirect} from "next/navigation"
import {getBookPathFromWorkId} from "../getBookPathFromWorkId"

const LegacyBookCompPage = async ({searchParams}: {searchParams?: {[_key: string]: string}}) => {
  if (!searchParams || !parseInt(searchParams.id)) notFound()
  const bookNodePath = await getBookPathFromWorkId(parseInt(searchParams.id))

  if (bookNodePath) redirect(`${bookNodePath}/desk-examination-copy-requests`)
  notFound()
}

export default LegacyBookCompPage
