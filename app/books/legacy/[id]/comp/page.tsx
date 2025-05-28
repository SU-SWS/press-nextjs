import {notFound, redirect} from "next/navigation"
import {getLegacyBookPaths, getNewBookPath} from "@lib/utils/getLegacyBookPaths"

export const revalidate = false
export const dynamic = "force-static"

const LegacyBookPage = async (props: {params: Promise<{id: string}>}) => {
  const params = await props.params
  const newPath = await getNewBookPath(params.id, "/desk-examination-copy-requests")
  if (newPath) redirect(newPath)
  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  if (process.env.VERCEL_ENV === "preview") return []
  const params = await getLegacyBookPaths()
  return params.map(item => ({id: item.id.toString()})).slice(0, 2000)
}

export default LegacyBookPage
