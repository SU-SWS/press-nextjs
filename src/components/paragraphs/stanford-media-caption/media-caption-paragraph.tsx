import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordMediaCaption} from "@lib/gql/__generated__/drupal.d";
import Image from "next/image";
import Oembed from "@components/elements/ombed";
import Link from "@components/elements/link";
import Wysiwyg from "@components/elements/wysiwyg";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordMediaCaption
}

const MediaCaptionParagraph = ({paragraph, ...props}: Props) => {
  const image = paragraph.suMediaCaptionMedia?.__typename === "MediaImage" ? paragraph.suMediaCaptionMedia.mediaImage : undefined;
  const videoUrl = paragraph.suMediaCaptionMedia?.__typename === "MediaVideo" && paragraph.suMediaCaptionMedia.mediaOembedVideo;

  return (
    <figure
      {...props}
      className={twMerge("centered lg:max-w-[980px]", props.className)}
    >
      {image?.url &&
        <div className="relative aspect-[16/9] w-full">
          <Image
            className="object-cover"
            src={image.url}
            alt={image.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </div>
      }
      {videoUrl && <Oembed url={videoUrl}/>}

      <figcaption>
        {paragraph.suMediaCaptionLink?.url &&
          <Link href={paragraph.suMediaCaptionLink.url} className="link--action font-normal text-stone-dark *:text-stone-dark hocus:text-archway-dark *:hocus:text-archway-dark">
            {paragraph.suMediaCaptionLink.title}
          </Link>
        }

        <Wysiwyg html={paragraph.suMediaCaptionCaption?.processed} className="children:text-18 rs-mb-4"/>

      </figcaption>
    </figure>
  )
}
export default MediaCaptionParagraph