import React, {ElementType, HtmlHTMLAttributes} from "react"
import Image from "@components/images/image"
import {Maybe} from "@lib/gql/__generated__/graphql"
import cn from "@lib/utils/className"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Absolute image url path.
   */
  imageUrl?: Maybe<string>
  /**
   * Image alt string.
   */
  imageAlt?: Maybe<string>
  /**
   * Is the banner supposed to be a section or a div.
   */
  isSection?: Maybe<boolean>
  /**
   * Eagerly load the banner image.
   */
  eagerLoadImage?: Maybe<boolean>
  /**
   * Position of the text over the image.
   */
  overlayPosition?: Maybe<"left" | "right">
}

const HeroBanner = ({imageUrl, imageAlt, eagerLoadImage, isSection, overlayPosition, children, ...props}: Props) => {
  const BannerWrapper: ElementType = isSection ? "section" : "div"

  return (
    <BannerWrapper {...props} className={cn("@container rs-mb-5 md:min-h-[400px]", props.className)}>
      <div className="relative aspect-video w-full bg-cool-grey @6xl:absolute @6xl:h-full">
        {imageUrl && (
          <Image
            className="ed11y-ignore object-cover"
            src={imageUrl}
            alt={imageAlt || ""}
            loading={eagerLoadImage ? "eager" : "lazy"}
            fill
            sizes="100vw"
          />
        )}
      </div>

      {children && (
        <div
          className={cn(
            "relative flex w-full flex-col gap-25 rs-p-2 shadow-lg @6xl:z-10 @6xl:my-60 @6xl:max-w-[550px] @6xl:bg-white",
            overlayPosition === "right" ? "@6xl:mr-50 @6xl:ml-auto" : "@6xl:mr-auto @6xl:ml-50"
          )}
        >
          {children}
        </div>
      )}
    </BannerWrapper>
  )
}
export default HeroBanner
