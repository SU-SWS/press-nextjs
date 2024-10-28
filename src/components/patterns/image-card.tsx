import {twMerge} from "tailwind-merge"
import Image from "next/image"
import Oembed from "@components/elements/ombed"
import {ElementType, HTMLAttributes} from "react"
import {Maybe} from "@lib/gql/__generated__/drupal.d"
import clsx from "clsx"

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
   * If card should contain border, box shadow,  and content padding styles
   */
  hasBorder?: Maybe<boolean>
}

const ImageCard = ({imageUrl, imageAlt, videoUrl, isArticle, children, hasBorder, ...props}: Props) => {
  const CardWrapper: ElementType = isArticle ? "article" : "div"

  return (
    <CardWrapper
      {...props}
      className={twMerge("centered w-full lg:max-w-[980px]", clsx({"border shadow": hasBorder}), props.className)}
    >
      {imageUrl && (
        <div className="relative aspect-[16/9] w-full">
          <Image
            className="object-cover object-center"
            src={imageUrl}
            alt={imageAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </div>
      )}

      {videoUrl && <Oembed url={videoUrl} />}

      <div className={twMerge("flex flex-col gap-5", clsx({"rs-p-1": hasBorder, "rs-pr-2 rs-py-2": !hasBorder}))}>
        {children}
      </div>
    </CardWrapper>
  )
}

export const ImageCardSkeleton = () => {
  return (
    <div className="centered w-full border border-black-10 pb-20 shadow-lg lg:max-w-[980px]">
      <div className="aspect-[16/9] w-full bg-black-10"></div>
    </div>
  )
}

export default ImageCard
