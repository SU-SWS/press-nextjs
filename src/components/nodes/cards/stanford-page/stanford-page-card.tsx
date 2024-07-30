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
    <ImageCard {...props} aria-labelledby={node.id} imageUrl={image?.url} imageAlt={image?.alt} isArticle hasBorder>
      <Heading className="type-1 font-medium [&_a]:text-stone-dark" id={node.id}>
        <Link href={node.path} className="group flex items-center gap-3">
          {node.title}
          <ChevronRightIcon width={24} className="text-digital-red" />
        </Link>
      </Heading>

      {node.suPageDescription && <p>{node.suPageDescription}</p>}
    </ImageCard>
  )
}
export default StanfordPageCard
