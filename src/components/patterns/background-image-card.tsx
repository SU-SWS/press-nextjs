import {twMerge} from "tailwind-merge";
import Image from "next/image";
import Oembed from "@components/elements/ombed";
import {ElementType, HTMLAttributes} from "react";
import {Maybe} from "@lib/gql/__generated__/drupal";

type Props = HTMLAttributes<HTMLElement | HTMLDivElement> & {
  /**
   * Absolute image url path.
   */
  imageUrl?: Maybe<string>
  /**
   * Image alt string.
   */
  imageAlt?: Maybe<string>
  /**
   * Absolute url for the video, typically an oembed url.
   */
  videoUrl?: Maybe<string>
  /**
   * If the wrapper should be an article or a div, use an article if an appropriate heading is within the card.
   */
  isArticle?: Maybe<boolean>
}

const BackgroundImageCard = ({imageUrl, imageAlt, videoUrl, isArticle, children, ...props}: Props) => {
  const CardWrapper: ElementType = isArticle ? "article" : "div";

  return (
    <CardWrapper
      {...props}
      className={twMerge("centered lg:max-w-[980px] w-full shadow-lg border border-black-10", props.className)}
    >
      {imageUrl &&
        <div className="relative aspect-[9/16] w-full">
          <Image
            className="object-cover object-center"
            src={imageUrl}
            alt={imageAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </div>
      }

      {videoUrl &&
        <Oembed url={videoUrl}/>
      }

      <div className="absolute top-0 left-0 h-full w-full flex flex-col gap-5 text-center">
        {children}
      </div>
    </CardWrapper>
  )
}

export default BackgroundImageCard;