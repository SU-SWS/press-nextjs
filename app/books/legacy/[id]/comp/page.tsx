import {notFound, permanentRedirect} from "next/navigation"
import {getLegacyBookPaths, getNewBookPath} from "@lib/utils/getLegacyBookPaths"

export const instant = false

const LegacyBookPage = async (props: {params: Promise<{id: string}>}) => {
  const params = await props.params
  const newPath = await getNewBookPath(params.id, "/desk-examination-copy-requests")
  if (newPath) permanentRedirect(newPath)
  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  if (process.env.VERCEL_ENV !== "production") return [{id: "1"}]
  const params = await getLegacyBookPaths()
  return params.map(item => ({id: item.uuid.toString()})).slice(0, 100)
}

export default LegacyBookPage
