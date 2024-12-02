import Rows from "@components/paragraphs/rows/rows"
import {notFound} from "next/navigation"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import SupCarouselParagraph from "@components/paragraphs/sup-carousel/sup-carousel-paragraph"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false
export const dynamic = "force-static"

const Home = async () => {
  const {entity} = await getEntityFromPath<NodeStanfordPage>("/", isPreviewMode())

  if (!entity) notFound()

  return (
    <article>
      <NodePageMetadata metatags={entity.metatag} />
      {entity.suPageBanner?.__typename === "ParagraphSupCarousel" && (
        <header className="mb-32">
          <SupCarouselParagraph paragraph={entity.suPageBanner} isTopBanner />
        </header>
      )}

      {entity.suPageComponents && <Rows components={entity.suPageComponents} />}
    </article>
  )
}

export default Home
