import NodePage from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getAllNodes, getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound, redirect} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/drupal/utils"
import SupBookExcerptPage from "@components/nodes/pages/sup-book/sup-book-excerpt-page"
import SupBookDeskExaminationPage from "@components/nodes/pages/sup-book/sup-book-desk-examination-page"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false
export const dynamic = "force-static"
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

const Page = async (props: PageProps) => {
  const params = await props.params
  const {path, page} = getBookPageRequested(getPathFromContext(params.slug))

  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(path)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  if (entity.__typename === "NodeSupBook") {
    if (page === "excerpt") return <SupBookExcerptPage node={entity} />
    if (page === "copy-requests") return <SupBookDeskExaminationPage node={entity} />
  }

  return <NodePage node={entity} />
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  const pagesToBuild = parseInt(process.env.BUILD_PAGES || "0")
  if (pagesToBuild === 0) return []
  const nodePaths = (await getAllNodes()).map(node => ({slug: node.path.split("/").filter(part => !!part)}))
  return pagesToBuild < 0 ? nodePaths : nodePaths.slice(0, pagesToBuild)
}

// Auxiliary pages for the book pages.
const getBookPageRequested = (path: string): {path: string; page: "excerpt" | "copy-requests" | "detail"} => {
  if (path.endsWith("/excerpts")) {
    return {path: path.replace(/\/excerpts$/, ""), page: "excerpt"}
  }

  if (path.endsWith("/desk-examination-copy-requests")) {
    return {path: path.replace(/\/desk-examination-copy-requests$/, ""), page: "copy-requests"}
  }

  return {path, page: "detail"}
}

export default Page
