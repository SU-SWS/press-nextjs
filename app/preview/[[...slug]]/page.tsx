import NodePage from "@components/nodes/pages/node-page"
import UnpublishedBanner from "@components/elements/unpublished-banner"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/drupal/utils"
import NodePageSkeleton from "@components/nodes/pages/node-page-skeleton"
import {Suspense} from "react"

// A cold render is a single Route query against Drupal. The ceiling exists to cap a hung upstream, not to
// accommodate a slow one.
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 30

const PreviewPage = (props: PageProps) => {
  return (
    <Suspense fallback={<NodePageSkeleton />}>
      <PreviewContents params={props.params} />
    </Suspense>
  )
}

/**
 * Everything below depends on the requested path, so it streams in behind the
 * suspense boundary above and keeps the navigation into this route instant.
 */
const PreviewContents = async ({params: paramsPromise}: {params: PageProps["params"]}) => {
  const params = await paramsPromise
  const path = getPathFromContext(params.slug || "/")
  const {entity} = await getEntityFromPath<NodeUnion>(path, true)

  if (!entity) notFound()
  // Drupal links to the home page by its alias, e.g. `/home`, so compare against that rather than `/`.
  const homePath = await getHomePagePath()

  return (
    <UnpublishedBanner status={entity.status} message="Unpublished Page">
      <NodePage node={entity} isHome={path === "/" || path === homePath} />
    </UnpublishedBanner>
  )
}

export const generateStaticParams = (): Array<Slug> => {
  return [{slug: ["/"]}]
}

export default PreviewPage
