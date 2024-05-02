import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordCard} from "@lib/gql/__generated__/drupal.d";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {H2, H3, H4} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import ActionLink from "@components/elements/action-link";
import Button from "@components/elements/button";
import {twMerge} from "tailwind-merge";
import ImageCard from "@components/patterns/image-card";
import BackgroundImageCard from "@components/patterns/background-image-card";
import {clsx} from "clsx";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordCard
}

const CardParagraph = ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph)

  const image = paragraph.suCardMedia?.__typename === "MediaImage" ? paragraph.suCardMedia.mediaImage : undefined;
  const videoUrl = paragraph.suCardMedia?.__typename === "MediaVideo" ? paragraph.suCardMedia.mediaOembedVideo : undefined;

  const headerTagChoice = (behaviors.su_card_styles?.heading || "h2").split(".", 2);
  const headerTag = headerTagChoice[0]
  const headerClasses = headerTagChoice[1]?.replace(".", " ").replace("su-font-splash", "text-m2 font-bold")

  const hideHeader = behaviors.su_card_styles?.hide_heading;
  const Component = behaviors.su_card_styles?.card_style === "bg-image" ? BackgroundImageCard : ImageCard;

  return (
    <Component
      {...props}
      aria-labelledby={paragraph.suCardHeader ? paragraph.id : undefined}
      imageUrl={image?.url}
      imageAlt={image?.alt}
      videoUrl={videoUrl}
      isArticle={!!paragraph.suCardHeader}
    >
      <div className={twMerge(clsx({
        "h-full p-20 bg-opacity-25 text-white": !!behaviors.su_card_styles?.bg_color,
        "bg-pink-600": behaviors.su_card_styles?.bg_color === "magenta",
        "bg-purple-600": behaviors.su_card_styles?.bg_color === "indigo",
        "bg-black-600": behaviors.su_card_styles?.bg_color === "steel",
        "bg-green-600": behaviors.su_card_styles?.bg_color === "grass",
        "bg-transparent": behaviors.su_card_styles?.card_style !== "bg-image"
      }))}>
        {paragraph.suCardHeader &&
          <div id={paragraph.id} className={clsx("order-2", {"sr-only": hideHeader})}>
            {headerTag === "h2" &&
              <H2 className={headerClasses}>{paragraph.suCardHeader}</H2>
            }
            {headerTag === "h3" &&
              <H3 className={headerClasses}>{paragraph.suCardHeader}</H3>
            }
            {headerTag === "h4" &&
              <H4 className={headerClasses}>{paragraph.suCardHeader}</H4>
            }
            {headerTag === "div" &&
              <div className={headerClasses}>{paragraph.suCardHeader}</div>
            }
          </div>
        }

        {paragraph.suCardSuperHeader &&
          <div className="order-1 font-semibold">
            {paragraph.suCardSuperHeader}
          </div>
        }

        <Wysiwyg html={paragraph.suCardBody?.processed} className="order-3"/>

        {paragraph.suCardLink?.url &&
          <div className="order-4">
            {behaviors.su_card_styles?.link_style === "action" &&
              <ActionLink href={paragraph.suCardLink.url}>
                {paragraph.suCardLink.title}
              </ActionLink>
            }

            {behaviors.su_card_styles?.link_style != "action" &&
              <Button href={paragraph.suCardLink.url}>
                {paragraph.suCardLink.title}
              </Button>
            }
          </div>
        }
      </div>
    </Component>
  )
}

export default CardParagraph
