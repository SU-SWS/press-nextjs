"use cache: remote"

import Rows from "@components/paragraphs/rows/rows"
import {notFound} from "next/navigation"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import SupCarouselParagraph from "@components/paragraphs/sup-carousel/sup-carousel-paragraph"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {cacheTag} from "next/cache"

const Home = async () => {
  cacheTag("paths:/")
  const {entity} = await getEntityFromPath<NodeStanfordPage>("/")

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
