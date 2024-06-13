import {twMerge} from "tailwind-merge"
import Image from "next/image"
import Oembed from "@components/elements/ombed"
import {ElementType, HTMLAttributes} from "react"
import {Maybe} from "@lib/gql/__generated__/drupal"
import {clsx} from "clsx"

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
  /**
   * Background color choice.
   */
  color?: "magenta" | "steel" | "indigo" | "grass"
}

const BackgroundImageCard = ({imageUrl, imageAlt, videoUrl, isArticle, children, color, ...props}: Props) => {
  const CardWrapper: ElementType = isArticle ? "article" : "div"

  return (
    <CardWrapper
      {...props}
      className={twMerge("centered relative w-full border border-black-10 shadow-lg lg:max-w-[980px]", props.className)}
    >
      <div
        className={clsx("absolute left-0 top-0 -z-10 h-full w-full", {
          "bg-plum": color === "magenta",
          "bg-press-grass": color === "grass",
          "bg-black-true bg-opacity-70": color === "steel",
          "bg-press-indigo": color === "indigo",
        })}
      >
        {imageUrl && (
          <Image
            className="object-cover mix-blend-multiply"
            src={imageUrl}
            alt={imageAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        )}
      </div>

      {videoUrl && <Oembed url={videoUrl} />}

      <div className={clsx("p-20", {"text-white": !!color})}>{children}</div>
    </CardWrapper>
  )
}

export default BackgroundImageCard
