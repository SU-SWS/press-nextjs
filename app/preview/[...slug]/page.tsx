import NodePage from "@components/nodes/pages/node-page"
import UnpublishedBanner from "@components/elements/unpublished-banner"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/drupal/utils"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import {Suspense} from "react"

const PreviewPage = async (props: PageProps) => {
  const params = await props.params
  return (
    <Suspense>
      <Preview slug={params.slug} />
    </Suspense>
  )
}

const Preview = async ({slug}: {slug: string | string[]}) => {
  if (!(await isPreviewMode())) notFound()
  const {entity} = await getEntityFromPath<NodeUnion>(getPathFromContext(slug), true)

  if (!entity) notFound()

  return (
    <UnpublishedBanner status={entity.status} message="Unpublished Page">
      <NodePage node={entity} />
    </UnpublishedBanner>
  )
}

export const generateStaticParams = (): Array<Slug> => {
  return [{slug: ["/"]}]
}

export default PreviewPage
