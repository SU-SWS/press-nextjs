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
      className={twMerge("relative centered-container text-white", clsx({
        "text-center": !leftImage,
        "text-center lg:text-left": leftImage,
        "lg:pt-[300px] lg:mb-[-300px]": isTopHero
      }))}
    >

      <div
        className={clsx("-z-10 absolute h-full w-full top-0 left-0", {
          "bg-plum": color === "magenta",
          "bg-press-grass": color === "grass",
          "bg-black-true bg-opacity-70": color === "steel",
          "bg-press-indigo": color === "indigo"
        })}
      >
        <Image
          className="object-cover mix-blend-multiply"
          src={bgImage.url}
          alt=""
          fill
          sizes="100vw"
        />
      </div>

      <div
        className={twMerge("py-32 max-w-1200 mx-auto", clsx({
          "flex flex-col lg:flex-row items-center gap-20 py-32 max-w-1200 mx-auto": leftImage
        }))}
      >
        <div>
          <div className="flex flex-col mb-10">

            {slideParagraph.supSlideBook?.path &&

              <H2 className={clsx({"text-m1": slideParagraph.supSlideTitleSize === "small"})} id={slideParagraph.id}>
                <Link
                  className="text-white hocus:text-white no-underline hocus:underline"
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
              <div>
                {subtitle}
              </div>
            }

            <div className="order-first">
              {(!leftImage && image) &&
                <div className="mx-auto relative aspect-1 w-full max-w-3xl mb-12">
                  <Image className="object-cover" src={image.url} alt={image.alt || ""} fill sizes="500px"/>
                </div>
              }

              {eyebrow &&
                <div className="mb-5">
                  {eyebrow}
                </div>
              }
            </div>
          </div>

          <Wysiwyg
            html={body}
            className={clsx("mb-10", {"[&_p]:-text-m1": slideParagraph.supSlideBodySize === "small"})}
          />

          {slideParagraph.supSlideButton?.url &&
            <div className={clsx({"border-t pt-12": !leftImage})}>
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