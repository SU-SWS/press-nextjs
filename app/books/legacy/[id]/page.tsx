import {notFound, permanentRedirect} from "next/navigation"
import {getLegacyBookPaths, getNewBookPath} from "@lib/utils/getLegacyBookPaths"

export const instant = false

const LegacyBookPage = async (props: {params: Promise<{id: string}>}) => {
  const params = await props.params
  const newPath = await getNewBookPath(params.id)
  if (newPath) permanentRedirect(newPath)
  notFound()
}

// Prerender every known work id. Old `/books/title?id=` links are still followed constantly, and each redirect built
// here is served without a function invocation. Each one is a lookup in the cached work id list, so it adds little to
// the build. Unknown ids still render on request: `dynamicParams` isn't available with Cache Components, so the page
// calls `notFound()` for them instead.
export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  if (process.env.VERCEL_ENV !== "production") return [{id: "1"}]
  const params = await getLegacyBookPaths()
  return [...new Set(params.map(item => item.uuid.toString()))].map(id => ({id}))
}

export default LegacyBookPage
