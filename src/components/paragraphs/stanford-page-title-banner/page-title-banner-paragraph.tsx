import React, {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordPageTitleBanner} from "@lib/gql/__generated__/drupal.d"
import {H1} from "@components/elements/headers"
import Image from "next/image"
import cn from "@lib/utils/className"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPageTitleBanner
  pageTitle: string
  isHome?: boolean
}

const PageTitleBannerParagraph = ({paragraph, pageTitle, isHome, ...props}: Props) => {
  const color = paragraph.supTitleBannerColor
  return (
    <div
      {...props}
      className={cn(
        "rs-mb-5 relative flex min-h-[120px] flex-col items-center @container md:min-h-[220px]",
        props.className
      )}
    >
      <div
        className={cn("@6xl:aspect-auto absolute aspect-[16/9] h-full w-full", {
          "bg-plum": color === "magenta",
          "bg-press-grass": color === "grass",
          "bg-black-true bg-opacity-70": color === "steel",
          "bg-press-indigo": color === "indigo",
        })}
      >
        <Image
          className="ed11y-ignore object-cover mix-blend-multiply"
          src={paragraph.suTitleBannerImage.mediaImage.url}
          alt=""
          loading="eager"
          fill
          sizes="100vw"
        />
      </div>

      <div className={cn("z-10 flex max-w-1000 flex-grow items-center text-center text-white", {"sr-only": isHome})}>
        <H1 className="mb-[0.2em]">{pageTitle}</H1>
      </div>
    </div>
  )
}
export default PageTitleBannerParagraph
