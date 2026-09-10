import NodePage from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getAllNodes, getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound, redirect} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/drupal/utils"
import SupBookExcerptPage from "@components/nodes/pages/sup-book/sup-book-excerpt-page"
import SupBookDeskExaminationPage from "@components/nodes/pages/sup-book/sup-book-desk-examination-page"
import NodePageSkeleton from "@components/nodes/pages/node-page-skeleton"
import {Suspense} from "react"

// A cold render is a single Route query against Drupal. The ceiling exists to cap a hung upstream, not to
// accommodate a slow one.
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 30

const Page = (props: PageProps) => {
  return (
    <Suspense fallback={<NodePageSkeleton />}>
      <NodeContents params={props.params} />
    </Suspense>
  )
}

/**
 * Everything below depends on the requested path, so it streams in behind the
 * suspense boundary above and keeps the navigation into this route instant.
 */
const NodeContents = async ({params: paramsPromise}: {params: PageProps["params"]}) => {
  const params = await paramsPromise
  const requestedPath = getPathFromContext(params.slug || "/")
  const {path, page} = getBookPageRequested(requestedPath)

  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(path)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  if (entity.__typename === "NodeSupBook") {
    if (page === "excerpt") return <SupBookExcerptPage node={entity} />
    if (page === "copy-requests") return <SupBookDeskExaminationPage node={entity} />
  }

  return <NodePage node={entity} isHome={requestedPath === "/"} />
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  const pagesToBuild = parseInt(process.env.BUILD_PAGES || "0")

  if (pagesToBuild === 0) return [{slug: []}]
  const paths = (await getAllNodes()).map(node => node.path).filter(path => !!path) as Array<string>
  const nodePaths = paths.map(path => ({slug: path.split("/").filter(Boolean)}))
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
