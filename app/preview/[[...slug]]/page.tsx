import NodePage from "@components/nodes/pages/node-page"
import UnpublishedBanner from "@components/elements/unpublished-banner"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/drupal/utils"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60
export const instant = false

const PreviewPage = async (props: PageProps) => {
  const params = await props.params
  const path = getPathFromContext(params.slug || "/")
  const {entity} = await getEntityFromPath<NodeUnion>(path, true)

  if (!entity) notFound()

  return (
    <UnpublishedBanner status={entity.status} message="Unpublished Page">
      <NodePage node={entity} isHome={path === "/"} />
    </UnpublishedBanner>
  )
}

export const generateStaticParams = (): Array<Slug> => {
  return [{slug: ["/"]}]
}

export default PreviewPage
