import {HtmlHTMLAttributes} from "react";
import {ParagraphSupCarousel, ParagraphSupCarouselSlide} from "@lib/gql/__generated__/drupal.d";
import Slideshow from "@components/elements/slideshow";
import {H2} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import Link from "@components/elements/link";
import Image from "next/image";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {ArrowRightIcon} from "@heroicons/react/16/solid";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupCarousel
  /**
   * If the paragraph is configured in the "Top Banner" on Basic Pages.
   */
  isTopBanner?: boolean
}

const SupCarouselParagraph = ({paragraph, isTopBanner, ...props}: Props) => {
  const isTopHero = !!(paragraph.supCarouselTopHero && isTopBanner)

  return (
    <div
      {...props}
      data-top-hero={isTopHero || undefined}
      className={twMerge("relative", clsx({"lg:-top-[300px]": isTopHero}), props?.className)}
    >

      {paragraph.supCarouselSlides.length === 1 &&
        <div
          className="relative w-screen left-1/2 -translate-x-1/2"
        >
          <Slide slideParagraph={paragraph.supCarouselSlides[0]} isTopHero={isTopHero}/>
        </div>
      }

      {paragraph.supCarouselSlides.length > 1 &&
        <Slideshow
          slideshowProps={{slidesToShow: 1}}
          className="w-screen left-1/2 -translate-x-1/2"
        >
          {paragraph.supCarouselSlides.map(slide =>
            <div key={slide.id}>
              <Slide key={slide.id} slideParagraph={slide}/>
            </div>
          )}
        </Slideshow>
      }
    </div>
  )
}

const Slide = ({slideParagraph, isTopHero}: { slideParagraph: ParagraphSupCarouselSlide, isTopHero?: boolean }) => {
  const slideTitle = slideParagraph.supSlideTitle || slideParagraph.supSlideBook?.title
  const eyebrow = slideParagraph.supSlideEyebrow || (!slideParagraph.supSlideHide?.includes("author") && slideParagraph.supSlideBook?.supBookAuthorsFull);
  const subtitle = slideParagraph.supSlideSubtitle || slideParagraph.supSlideBook?.supBookSubtitle
  const bgImage = slideParagraph.supSlideBgImage.mediaImage;
  const image = slideParagraph.supSlideImage?.mediaImage || slideParagraph.supSlideBook?.supBookImage?.mediaImage;
  const body = slideParagraph.supSlideBody?.processed || slideParagraph.supSlideBook?.supBookLocalWebBlurb?.processed
  const color = slideParagraph.supSlideColor;
  const leftImage = slideParagraph.supSlideOrientation === "left_image"


  return (
    <article
      aria-labelledby={slideParagraph.id}
      className={twMerge("relative centered-container text-white w-full h-full min-h-full lg:min-h-screen", clsx({
        "text-center": !leftImage,
        "text-center lg:text-left": leftImage,
        "lg:pt-[300px] lg:mb-[-300px]": isTopHero
      }))}
    >
      <figure className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <Image
            className="relative object-cover"
            src={bgImage.url}
            alt=""
            fill
            sizes="100vw"
          />
      </figure>
      <div
        className={clsx("absolute top-0 left-0 block h-full w-full bg-opacity-80", {
          "bg-plum": color === "magenta",
          "bg-press-grass": color === "grass",
          "bg-black-true": color === "steel",
          "bg-press-indigo": color === "indigo"
        })}
      >
      </div>

      <div
        className={twMerge("relative rs-py-6 max-w-1200 mx-auto", clsx({
          "flex flex-col items-center": !leftImage,
          "flex flex-col lg:flex-row items-center gap-20 py-32 max-w-1200 mx-auto": leftImage
        }))}
      >
        <div className={clsx("rs-px-8 lg:px-0",{
          "max-w-[800px]" : !leftImage,
          "flex flex-col items-start" : leftImage,
        })}>
          <div className={clsx("flex flex-col", {"text-left" : leftImage, "text-center" : !leftImage})}>

            {slideParagraph.supSlideBook?.path &&
              <H2 className={clsx({"text-m1": slideParagraph.supSlideTitleSize === "small"})} id={slideParagraph.id}>
                <Link
                  className="font-medium text-white hocus:text-white no-underline hocus:underline"
                  href={slideParagraph.supSlideBook.path}
                >
                  {slideTitle}
                </Link>
              </H2>
            }

            {!slideParagraph.supSlideBook?.path &&
              <H2 className={clsx({"text-m1": slideParagraph.supSlideTitleSize === "small"})} id={slideParagraph.id}>
                {slideTitle}
              </H2>
            }

            {subtitle &&
              <div className="type-2 rs-mb-3">
                {subtitle}
              </div>
            }

            <div className="order-first">
              {(!leftImage && image) &&
                <div className="mx-auto relative aspect-1 max-w-3xl rs-mb-3 w-[200px]">
                  <Image className="object-cover" src={image.url} alt={image.alt || ""} fill sizes="200px"/>
                </div>
              }

              {eyebrow &&
                <div className="mb-5 type-1">
                  {eyebrow}
                </div>
              }
            </div>
          </div>

          <Wysiwyg
            html={body}
            className={clsx("rs-mb-3", {"[&_p]:-text-m1": slideParagraph.supSlideBodySize === "small", "text-left" : leftImage, "text-center" : !leftImage})}
          />

          {slideParagraph.supSlideButton?.url &&
            <div className={clsx({"border-t rs-pt-3": !leftImage})}>
              <Link
                className={clsx("text-white border flex items-center gap-5 w-fit p-6 hocus:text-white no-underline group", {"mx-auto": !leftImage})}
                href={slideParagraph.supSlideButton.url}
              >
                <span className="group-hocus:underline">{slideParagraph.supSlideButton.title}</span>
                <ArrowRightIcon width={20}/>
              </Link>
            </div>
          }
        </div>
        {(leftImage && image) &&
          <div className="order-first relative aspect-[11/16] w-1/2 max-w-2xl shrink-0 h-auto">
            <Image className="object-cover" src={image.url} alt={image.alt || ""} fill sizes="500px"/>
          </div>
        }
      </div>
    </article>
  )
}
export default SupCarouselParagraph