import CardParagraph from "@components/paragraphs/stanford-card/card-paragraph"
import EntityParagraph from "@components/paragraphs/stanford-entity/entity-paragraph"
import GalleryParagraph from "@components/paragraphs/stanford-gallery/gallery-paragraph"
import MediaCaptionParagraph from "@components/paragraphs/stanford-media-caption/media-caption-paragraph"
import SpacerParagraph from "@components/paragraphs/stanford-spacer/spacer-paragraph"
import WysiwygParagraph from "@components/paragraphs/stanford-wysiwyg/wysiwyg-paragraph"
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph"
import ListParagraph from "@components/paragraphs/stanford-lists/list-paragraph"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {Suspense} from "react"
import FileListParagraph from "@components/paragraphs/sup-file-list/file-list-paragraph"
import SupCarouselParagraph from "@components/paragraphs/sup-carousel/sup-carousel-paragraph"
import SupAuthorListParagraph from "@components/paragraphs/sup-author-list/sup-author-list-paragraph"
import SupSearchFormParagraph from "@components/paragraphs/sup-search-form/sup-search-form-paragraph"
import SupBlogTeaserParagraph from "@components/paragraphs/sup-blog-teaser/sup-blog-teaser-paragraph"
import UnpublishedBanner from "@components/elements/unpublished-banner"
import FaqParagraph from "@components/paragraphs/stanford-faq/faq-paragraph"

type Props = {
  /**
   * Paragraph entity todisplay.
   */
  paragraph: ParagraphUnion
}

const Paragraph = async ({paragraph}: Props) => {
  return (
    <UnpublishedBanner status={paragraph.status} message="Unpublished Content">
      <ParagraphComponent paragraph={paragraph} />
    </UnpublishedBanner>
  )
}
const ParagraphComponent = async ({paragraph}: Props) => {
  const itemProps: Record<string, string> = {}

  if (process.env.NODE_ENV === "development") {
    itemProps["data-type"] = paragraph.__typename || "unknown"
    itemProps["data-id"] = paragraph.id
  }

  switch (paragraph.__typename) {
    case "ParagraphStanfordBanner":
      return <BannerParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordCard":
      return <CardParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordEntity":
      return <EntityParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordGallery":
      return <GalleryParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordMediaCaption":
      return <MediaCaptionParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordSpacer":
      return <SpacerParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordWysiwyg":
      return <WysiwygParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordList":
      return (
        <Suspense>
          <ListParagraph paragraph={paragraph} {...itemProps} />
        </Suspense>
      )
    case "ParagraphSupFileList":
      return <FileListParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphSupCarousel":
      return <SupCarouselParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphSupAuthorList":
      return <SupAuthorListParagraph {...itemProps} />
    case "ParagraphSupSearchForm":
      return <SupSearchFormParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphSupBlogTeaser":
      return <SupBlogTeaserParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordFaq":
      return <FaqParagraph paragraph={paragraph} {...itemProps} />
  }
  console.warn(`Unknown paragraph ${paragraph.__typename}. Item ${paragraph.id}.`)
}
export default Paragraph
