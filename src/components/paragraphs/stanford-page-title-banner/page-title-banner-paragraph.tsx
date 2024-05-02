import React, {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordPageTitleBanner} from "@lib/gql/__generated__/drupal.d";
import {H1} from "@components/elements/headers";
import {twMerge} from "tailwind-merge";
import Image from "next/image";
import {clsx} from "clsx";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPageTitleBanner
  pageTitle: string
}

const PageTitleBannerParagraph = ({paragraph, pageTitle, ...props}: Props) => {

  return (
    <div
      {...props}
      className={twMerge("@container md:min-h-[400px] rs-mb-5 flex flex-col items-center", props.className)}
    >
      <div className={clsx("aspect-[16/9] @6xl:aspect-auto relative @6xl:absolute w-full @6xl:h-full ", {
        "mix-blend-hue": !!paragraph.supTitleBannerColor,
        "bg-pink-300": paragraph.supTitleBannerColor === "magenta",
        "bg-black-300": paragraph.supTitleBannerColor === "steel",
        "bg-green-600": paragraph.supTitleBannerColor === "grass",
        "bg-indigo-600": paragraph.supTitleBannerColor === "indigo",
      })}>
        <Image
          className={clsx("object-cover mix-blend-darken", )}
          src={paragraph.suTitleBannerImage.mediaImage.url}
          alt={paragraph.suTitleBannerImage.mediaImage.alt || ""}
          loading="eager"
          fill
          sizes="100vw"
        />
      </div>


      <div className="relative @6xl:text-white z-10 text-center flex-grow flex items-center">
        <H1>
          {pageTitle}
        </H1>
      </div>
    </div>
  )
}
export default PageTitleBannerParagraph