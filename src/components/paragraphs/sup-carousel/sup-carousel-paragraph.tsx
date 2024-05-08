import {HtmlHTMLAttributes} from "react";
import {ParagraphSupCarousel, ParagraphSupCarouselSlide} from "@lib/gql/__generated__/drupal.d";
import Slideshow from "@components/elements/slideshow";
import {H2} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import Link from "@components/elements/link";
import Image from "next/image";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupCarousel
  /**
   * If the paragraph is configured in the "Top Banner" on Basic Pages.
   */
  isTopBanner?: boolean
}

const SupCarouselParagraph = ({paragraph, isTopBanner, ...props}: Props) => {
  return (
    <div
      {...props}
      className={twMerge(clsx({"relative pt-[300px] -mb-[300px] -top-[300px] bg-blue-50": isTopBanner && paragraph.supCarouselTopHero}), props?.className)}
    >
      {paragraph.supCarouselSlides.length === 1 && <Slide slideParagraph={paragraph.supCarouselSlides[0]}/>}

      {paragraph.supCarouselSlides.length > 1 &&
        <Slideshow slideshowProps={{slidesToShow: 1}}>
          {paragraph.supCarouselSlides.map(slide => <div key={slide.id}><Slide key={slide.id} slideParagraph={slide}/>
          </div>)}
        </Slideshow>
      }
    </div>
  )
}

const Slide = ({slideParagraph}: { slideParagraph: ParagraphSupCarouselSlide }) => {
  const bgImage = slideParagraph.supSlideBgImage.mediaImage;
  const slideTitle = slideParagraph.supSlideTitle || slideParagraph.supSlideBook?.title
  const image = slideParagraph.supSlideImage?.mediaImage || slideParagraph.supSlideBook?.supBookImage?.mediaImage;

  return (
    <article aria-labelledby={slideParagraph.id} className="relative centered-container">
      <Image
        className="object-cover"
        src={bgImage.url}
        alt={""}
        fill
        sizes="100vw"
      />

      <div className="xl:flex gap-10 xl:w-2/3 mx-auto">
        {image &&
          <div className="relative aspect-[9/16] w-1/3">
            <Image
              className="object-cover"
              src={image.url}
              alt={image.alt || ""}
              fill
            />
          </div>
        }
        <div>
          <div className="flex flex-col">
            {slideTitle && <H2 id={slideParagraph.id}>{slideTitle}</H2>}
            {slideParagraph.supSlideEyebrow && <div className="order-first">{slideParagraph.supSlideEyebrow}</div>}
          </div>

          {slideParagraph.supSlideSubtitle && <div>{slideParagraph.supSlideSubtitle}</div>}
          {slideParagraph.supSlideBody && <Wysiwyg html={slideParagraph.supSlideBody.processed}/>}
          {slideParagraph.supSlideButton?.url &&
            <Link href={slideParagraph.supSlideButton.url}>{slideParagraph.supSlideButton.title}</Link>
          }
        </div>
      </div>
    </article>
  )
}
export default SupCarouselParagraph