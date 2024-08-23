import {JSX, HtmlHTMLAttributes} from "react"
import {Maybe, ParagraphSupCarousel, ParagraphSupCarouselSlide} from "@lib/gql/__generated__/drupal.d"
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
          {paragraph.supCarouselSlides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              aria-roledescription="slide"
              aria-labelledby={slide.supSlideTitle ? slide.id : undefined}
              aria-label={
                slide.supSlideTitle ? undefined : `${slideIndex + 1} of ${paragraph.supCarouselSlides.length}`
              }
            >
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
        className={twMerge(
          "absolute left-0 top-0 block h-full w-full bg-opacity-80",
          clsx({
            "bg-plum": color === "magenta",
            "bg-press-grass": color === "grass",
            "bg-black-true": color === "steel",
            "bg-press-indigo": color === "indigo",
          })
        )}
      />

      <div
        className={twMerge(
          "relative mx-auto flex w-full max-w-1000 flex-col items-center justify-center py-32",
          clsx({
            "gap-20 lg:flex-row": leftImage,
          })
        )}
      >
        <div className="rs-px-8 w-full lg:px-0">
          {(slideTitle || (!leftImage && image) || eyebrow || subtitle) && (
            <div className={twMerge("flex flex-col", clsx({"text-left": leftImage, "text-center": !leftImage}))}>
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
                    <div className="rs-mb-3 relative mx-auto w-fit">
                      <CarouselImageLink
                        href={slideParagraph.supSlideButton?.url}
                        title={slideParagraph.supSlideButton?.title}
                      >
                        <Image
                          className="object-contain"
                          src={image.url}
                          alt={image.alt || ""}
                          sizes="(max-width: 768px) 100vw, 1200px"
                          height={image.height}
                          width={image.width}
                        />
                      </CarouselImageLink>
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
          )}
        </div>
        {leftImage && image && (
          <div className="relative order-first aspect-[11/16] h-auto w-full max-w-[21rem] shrink-0 md:w-1/2 md:max-w-[34rem]">
            <CarouselImageLink href={slideParagraph.supSlideButton?.url} title={slideParagraph.supSlideButton?.title}>
              <Image className="object-contain" src={image.url} alt={image.alt || ""} fill sizes="500px" />
            </CarouselImageLink>
          </div>
        )}
      </div>
    </SlideTag>
  )
}

const CarouselImageLink = ({
  href,
  title,
  children,
}: {
  href?: Maybe<string>
  title?: Maybe<string>
  children: JSX.Element
}) => {
  if (href) {
    return (
      <Link
        prefetch={false}
        href={href}
        title={title || undefined}
        aria-hidden
        tabIndex={-1}
        className="mx-auto block w-fit *:transition hover:*:scale-[1.02]"
      >
        {children}
      </Link>
    )
  }

  return <>{children}</>
}

export default SupCarouselParagraph
