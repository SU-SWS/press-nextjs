import {HtmlHTMLAttributes} from "react"
import {ParagraphSupCarousel, ParagraphSupCarouselSlide} from "@lib/gql/__generated__/drupal.d"
import Slideshow, {NextArrow, PrevArrow} from "@components/elements/slideshow"
import {H2} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"
import Image from "next/image"
import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {ArrowRightIcon} from "@heroicons/react/16/solid"

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
    <section
      {...props}
      aria-label="Page banner carousel"
      data-top-hero={isTopHero || undefined}
      className={twMerge("relative mb-32", clsx({"lg:-top-[300px] lg:mb-[-300px]": isTopHero}), props?.className)}
    >
      {paragraph.supCarouselSlides.length === 1 && (
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <Slide slideParagraph={paragraph.supCarouselSlides[0]} isTopHero={isTopHero} />
        </div>
      )}

      {paragraph.supCarouselSlides.length > 1 && (
        <Slideshow
          slideshowProps={{
            nextArrow: <NextArrow customClassName={clsx({"lg:mt-[150px]": isTopHero})} />,
            prevArrow: <PrevArrow customClassName={clsx({"lg:mt-[150px]": isTopHero})} />,
            slidesToShow: 1,
          }}
          className="overflow-hidden"
        >
          {paragraph.supCarouselSlides.map(slide => (
            <div key={slide.id}>
              <Slide key={slide.id} slideParagraph={slide} isTopHero={isTopHero} />
            </div>
          ))}
        </Slideshow>
      )}
    </section>
  )
}

const Slide = ({slideParagraph, isTopHero}: {slideParagraph: ParagraphSupCarouselSlide; isTopHero?: boolean}) => {
  const slideTitle = slideParagraph.supSlideTitle
  const eyebrow = slideParagraph.supSlideEyebrow
  const subtitle = slideParagraph.supSlideSubtitle
  const bgImage = slideParagraph.supSlideBgImage.mediaImage
  const image = slideParagraph.supSlideImage?.mediaImage
  const body = slideParagraph.supSlideBody?.processed
  const color = slideParagraph.supSlideColor
  const leftImage = slideParagraph.supSlideOrientation === "left_image"
  const SlideTag = slideTitle ? "article" : "div"

  let imageAspect = "aspect-1"
  const imageRatio = (image?.width && image?.height && image.width / image.height) || 0
  if (imageRatio <= 0.5) imageAspect = "aspect-[1/2]"
  if (imageRatio > 0.5 && imageRatio <= 0.75) imageAspect = "aspect-[2/3]"
  if (imageRatio > 0.75 && imageRatio <= 1.25) imageAspect = "aspect-1"
  if (imageRatio > 1.25 && imageRatio <= 1.75) imageAspect = "aspect-[3/2]"
  if (imageRatio > 1.75) imageAspect = "aspect-2"

  return (
    <SlideTag
      aria-labelledby={slideTitle ? slideParagraph.id : undefined}
      className={twMerge(
        "centered-container relative flex h-full min-h-full w-full bg-black text-white",
        clsx({
          "text-center": !leftImage,
          "text-center lg:text-left": leftImage,
          "lg:pt-[300px]": isTopHero,
        })
      )}
    >
      <figure className="absolute left-0 top-0 h-full w-full overflow-hidden">
        <Image
          className="ed11y-ignore relative object-cover"
          src={bgImage.url}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
        />
      </figure>
      <div
        className={clsx("absolute left-0 top-0 block h-full w-full bg-opacity-80", {
          "bg-plum": color === "magenta",
          "bg-press-grass": color === "grass",
          "bg-black-true": color === "steel",
          "bg-press-indigo": color === "indigo",
        })}
      />

      <div
        className={twMerge(
          "max-w-1100 rs-py-6 relative mx-auto flex w-full flex-col items-center justify-center",
          clsx({
            "gap-20 py-32 lg:flex-row": leftImage,
          })
        )}
      >
        <div className="rs-px-8 w-full lg:px-0">
          {(slideTitle || (!leftImage && image) || eyebrow || subtitle) && (
            <div className={clsx("flex flex-col", {"text-left": leftImage, "text-center": !leftImage})}>
              {slideTitle && (
                <H2
                  className={twMerge("type-4", clsx({"type-0": slideParagraph.supSlideTitleSize === "small"}))}
                  id={slideParagraph.id}
                >
                  {slideTitle}
                </H2>
              )}

              {subtitle && <div className="rs-mb-3 type-2">{subtitle}</div>}

              {((!leftImage && image) || eyebrow) && (
                <div className="order-first">
                  {!leftImage && image && (
                    <div className={twMerge("rs-mb-3 relative mx-auto aspect-1 w-full", imageAspect)}>
                      <Image
                        className="object-contain"
                        src={image.url}
                        alt={image.alt || ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                      />
                    </div>
                  )}

                  {eyebrow && <div className="type-1 mb-5">{eyebrow}</div>}
                </div>
              )}
            </div>
          )}
          <Wysiwyg
            html={body}
            className={twMerge(
              "rs-mb-3",
              clsx({
                "text-left": leftImage,
                "text-center": !leftImage,
              })
            )}
          />

          {slideParagraph.supSlideButton?.url && (
            <div className={clsx({"rs-pt-3 border-t": !leftImage})}>
              <Link
                className={clsx(
                  "group flex w-fit items-center gap-5 border p-6 text-white no-underline hocus:text-white",
                  {"mx-auto": !leftImage}
                )}
                href={slideParagraph.supSlideButton.url}
              >
                <span className="group-hocus:underline">{slideParagraph.supSlideButton.title}</span>
                <ArrowRightIcon width={20} />
              </Link>
            </div>
          )}
        </div>
        {leftImage && image && (
          <div className="relative order-first aspect-[11/16] h-auto w-full max-w-[21rem] shrink-0 md:w-1/2 md:max-w-2xl">
            <Image className="object-cover" src={image.url} alt={image.alt || ""} fill sizes="500px" />
          </div>
        )}
      </div>
    </SlideTag>
  )
}
export default SupCarouselParagraph
