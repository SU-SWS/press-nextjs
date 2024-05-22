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
  const color = paragraph.supTitleBannerColor;
  return (
    <div
      {...props}
      className={twMerge("@container min-h-[200px] md:min-h-[400px] rs-mb-5 flex flex-col items-center", props.className)}
    >
      <div className={clsx("aspect-[16/9] @6xl:aspect-auto absolute w-full h-full ", {
        "bg-plum": color === "magenta",
        "bg-press-grass": color === "grass",
        "bg-black-true bg-opacity-70": color === "steel",
        "bg-press-indigo": color === "indigo"
      })}>
        <Image
          className="object-cover mix-blend-multiply"
          src={paragraph.suTitleBannerImage.mediaImage.url}
          alt={paragraph.suTitleBannerImage.mediaImage.alt || ""}
          loading="eager"
          fill
          sizes="100vw"
        />
      </div>


      <div className="text-white z-10 text-center flex-grow flex items-center">
        <H1>
          {pageTitle}
        </H1>
      </div>
    </div>
  )
}
export default PageTitleBannerParagraph