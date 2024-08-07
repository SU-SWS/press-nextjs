import React, {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordPageTitleBanner} from "@lib/gql/__generated__/drupal.d"
import {H1} from "@components/elements/headers"
import {twMerge} from "tailwind-merge"
import Image from "next/image"
import {clsx} from "clsx"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPageTitleBanner
  pageTitle: string
}

const PageTitleBannerParagraph = ({paragraph, pageTitle, ...props}: Props) => {
  const color = paragraph.supTitleBannerColor
  return (
    <div
      {...props}
      className={twMerge(
        "rs-mb-7 flex min-h-[200px] flex-col items-center @container md:min-h-[250px]",
        props.className
      )}
    >
      <div
        className={clsx("@6xl:aspect-auto absolute aspect-[16/9] h-full w-full", {
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

      <div className="z-10 flex max-w-1000 flex-grow items-center text-center text-white">
        <H1>{pageTitle}</H1>
      </div>
    </div>
  )
}
export default PageTitleBannerParagraph
