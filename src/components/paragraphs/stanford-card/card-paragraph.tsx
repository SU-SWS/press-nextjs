import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordCard} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {H2, H3, H4} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import ActionLink from "@components/elements/action-link"
import Button from "@components/elements/button"
import ImageCard from "@components/patterns/image-card"
import BackgroundImageCard from "@components/patterns/background-image-card"
import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {CardParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordCard
}

const CardParagraph = ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<CardParagraphBehaviors>(paragraph)

  const image = paragraph.suCardMedia?.__typename === "MediaImage" ? paragraph.suCardMedia.mediaImage : undefined
  const videoUrl =
    paragraph.suCardMedia?.__typename === "MediaVideo" ? paragraph.suCardMedia.mediaOembedVideo : undefined

  const headerTagChoice = (behaviors.su_card_styles?.heading || "h2").split(".", 2)
  const headerTag = headerTagChoice[0]
  const headerClasses = headerTagChoice[1]?.replace(".", " ").replace("su-font-splash", "type-1 font-medium")

  const hideHeader = behaviors.su_card_styles?.hide_heading
  const Component = behaviors.su_card_styles?.card_style === "bg-image" ? BackgroundImageCard : ImageCard
  return (
    <Component
      {...props}
      aria-labelledby={paragraph.suCardHeader ? paragraph.id : undefined}
      imageUrl={image?.url}
      imageAlt={image?.alt}
      videoUrl={videoUrl}
      isArticle={!!paragraph.suCardHeader}
      color={behaviors.su_card_styles?.bg_color}
    >
      {paragraph.suCardHeader && (
        <div id={paragraph.id} className={clsx("order-2", {"sr-only": hideHeader})}>
          {headerTag === "h2" && (
            <H2 className={twMerge("mb-0 flex items-center", headerClasses)}>{paragraph.suCardHeader}</H2>
          )}
          {headerTag === "h3" && <H3 className={headerClasses}>{paragraph.suCardHeader}</H3>}
          {headerTag === "h4" && <H4 className={headerClasses}>{paragraph.suCardHeader}</H4>}
          {headerTag === "div" && <div className={headerClasses}>{paragraph.suCardHeader}</div>}
        </div>
      )}

      {paragraph.suCardSuperHeader && <div className="order-1 font-semibold">{paragraph.suCardSuperHeader}</div>}

      <Wysiwyg html={paragraph.suCardBody?.processed} className="rs-pb-2 order-3 *:text-21" />

      {paragraph.suCardLink?.url && (
        <div className="order-4">
          {behaviors.su_card_styles?.link_style === "action" && (
            <ActionLink
              href={paragraph.suCardLink.url}
              className="font-normal text-stone-dark no-underline *:text-stone-dark hocus:underline"
            >
              {paragraph.suCardLink.title}
            </ActionLink>
          )}

          {behaviors.su_card_styles?.link_style != "action" && (
            <Button href={paragraph.suCardLink.url}>{paragraph.suCardLink.title}</Button>
          )}
        </div>
      )}
    </Component>
  )
}

export default CardParagraph
