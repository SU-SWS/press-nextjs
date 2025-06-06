import Rows from "@components/paragraphs/rows/rows"
import InteriorPage from "@components/layouts/interior-page"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph"
import PageTitleBannerParagraph from "@components/paragraphs/stanford-page-title-banner/page-title-banner-paragraph"
import SupCarouselParagraph from "@components/paragraphs/sup-carousel/sup-carousel-paragraph"
import clsx from "clsx"
import {twMerge} from "tailwind-merge"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPagePage = ({node, ...props}: Props) => {
  const fullWidth = node.layoutSelection?.id === "stanford_basic_page_full"

  return (
    <article {...props}>
      <NodePageMetadata
        key={node.id}
        metatags={node.metatag}
        pageTitle={node.title}
        backupDescription={getFirstText(node.suPageComponents)}
      />
      {node.suPageBanner?.__typename && (
        <header>
          {node.suPageBanner?.__typename === "ParagraphStanfordBanner" && (
            <BannerParagraph paragraph={node.suPageBanner} eagerLoadImage />
          )}

          {node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && (
            <PageTitleBannerParagraph paragraph={node.suPageBanner} pageTitle={node.title} />
          )}

          {node.suPageBanner?.__typename === "ParagraphSupCarousel" && (
            <SupCarouselParagraph paragraph={node.suPageBanner} isTopBanner />
          )}
        </header>
      )}

      {node.suPageBanner?.__typename !== "ParagraphStanfordPageTitleBanner" && (
        <H1 className={twMerge("centered mt-32", clsx({"lg:max-w-1200": fullWidth}))}>{node.title}</H1>
      )}

      {!fullWidth && (
        <InteriorPage currentPath={node.path || "#"}>
          <Rows components={node.suPageComponents} />
        </InteriorPage>
      )}

      {fullWidth && <Rows components={node.suPageComponents} />}
    </article>
  )
}
export default StanfordPagePage
