import Rows from "@components/paragraphs/rows/rows"
import {notFound} from "next/navigation"
import {getConfigPageField, getEntityFromPath} from "@lib/gql/gql-queries"
import {NodeStanfordPage, NodeUnion, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import {Metadata} from "next"
import {getNodeMetadata} from "./[...slug]/metadata"
import SupCarouselParagraph from "@components/paragraphs/sup-carousel/sup-carousel-paragraph"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false
export const dynamic = "force-static"

const Home = async () => {
  const {entity} = await getEntityFromPath<NodeStanfordPage>("/", isPreviewMode())

  if (!entity) notFound()

  return (
    <article>
      {entity.suPageBanner?.__typename === "ParagraphSupCarousel" && (
        <header className="mb-32">
          <SupCarouselParagraph paragraph={entity.suPageBanner} isTopBanner />
        </header>
      )}

      {entity.suPageComponents && <Rows components={entity.suPageComponents} />}
    </article>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const siteName = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteName"]>(
    "StanfordBasicSiteSetting",
    "suSiteName"
  )

  const {entity} = await getEntityFromPath<NodeUnion>("/")
  const metadata = entity ? getNodeMetadata(entity) : {}
  metadata.title = siteName || metadata.title
  if (metadata.openGraph?.title) metadata.openGraph.title = siteName || metadata.openGraph.title
  return metadata
}

export default Home
