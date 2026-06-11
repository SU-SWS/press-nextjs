"use cache: remote"

import {notFound, redirect} from "next/navigation"
import {getLegacyBookPaths, getNewBookPath} from "@lib/utils/getLegacyBookPaths"

const LegacyBookPage = async (props: {params: Promise<{id: string}>}) => {
  const params = await props.params
  const newPath = await getNewBookPath(params.id, "/excerpts")
  if (newPath) redirect(newPath)
  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  if (process.env.VERCEL_ENV === "preview") return [{id: "1"}]
  const params = await getLegacyBookPaths()
  return params.map(item => ({id: item.uuid.toString()})).slice(0, 100)
}

export default LegacyBookPage
