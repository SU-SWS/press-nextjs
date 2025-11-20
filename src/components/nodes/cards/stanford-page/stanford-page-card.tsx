import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import ImageCard from "@components/patterns/image-card"
import {ChevronRightIcon} from "@heroicons/react/24/outline"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPageCard = ({node, headingLevel, ...props}: Props) => {
  const pageTitleBannerImage =
    node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" &&
    node.suPageBanner.suTitleBannerImage.mediaImage
  const bannerImage =
    node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage || undefined

  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <ImageCard
      {...props}
      className="relative"
      aria-labelledby={node.uuid}
      imageUrl={image?.url}
      imageAlt={image?.alt}
      isArticle
      hasBorder
    >
      <Heading className="type-0 mb-0 xl:text-21 [&_a]:text-stone-dark" id={node.uuid}>
        <Link href={node.path || "#"} className="group stretched-link flex items-center gap-3 font-semibold">
          {node.title}
          <ChevronRightIcon width={24} className="shrink-0 text-digital-red transition-all group-hocus:translate-x-2" />
        </Link>
      </Heading>

      {node.suPageDescription && <p>{node.suPageDescription}</p>}
    </ImageCard>
  )
}
export default StanfordPageCard
