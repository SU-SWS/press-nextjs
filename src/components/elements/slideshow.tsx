"use client"

import {HTMLAttributes, JSX, useEffect, useRef} from "react"
import Slider, {CustomArrowProps, Settings} from "react-slick"
import {ArrowLongRightIcon, ArrowLongLeftIcon} from "@heroicons/react/24/outline"
import {twMerge} from "tailwind-merge"
import {clsx} from "clsx"

export const NextArrow = ({
  customClassName,
  className: slickClassNames,
  onClick,
}: CustomArrowProps & {customClassName?: string}) => {
  const slickDisabled = slickClassNames?.includes("slick-disabled")
  return (
    <button
      className={twMerge("absolute right-5 top-1/2 z-50 h-16 w-16 sm:h-20 sm:w-20 lg:right-20", customClassName)}
      onClick={onClick}
      aria-label="Next"
      disabled={slickDisabled}
    >
      <ArrowLongRightIcon className={twMerge("text-white", clsx({"text-fog-dark": slickDisabled}))} />
    </button>
  )
}

export const PrevArrow = ({
  customClassName,
  className: slickClassNames,
  onClick,
}: CustomArrowProps & {customClassName?: string}) => {
  const slickDisabled = slickClassNames?.includes("slick-disabled")
  return (
    <button
      className={twMerge("absolute left-5 top-1/2 z-50 h-16 w-16 sm:h-20 sm:w-20 lg:left-20", customClassName)}
      onClick={onClick}
      aria-label="Previous"
      disabled={slickDisabled}
    >
      <ArrowLongLeftIcon className={twMerge("text-white", clsx({"text-fog-dark": slickDisabled}))} />
    </button>
  )
}

type SlideshowProps = HTMLAttributes<HTMLDivElement> & {
  children: JSX.Element | JSX.Element[]
  slideshowProps?: Omit<Settings, "children">
}

const Slideshow = ({children, slideshowProps, ...props}: SlideshowProps) => {
  const slideShowRef = useRef<HTMLDivElement>(null)

  const adjustSlideLinks = () => {
    // Set tabindex attributes based on if the slides are visible or not.
    const hiddenLinks = slideShowRef.current?.querySelectorAll(".slick-slide:not(.slick-active) a")
    if (hiddenLinks) {
      ;[...hiddenLinks].map(link => link.setAttribute("tabindex", "-1"))
    }

    const visibleLinks = slideShowRef.current?.querySelectorAll(".slick-slide.slick-active a:not([aria-hidden])")
    if (visibleLinks) {
      ;[...visibleLinks].map(link => link.removeAttribute("tabindex"))
    }
  }

  useEffect(() => {
    adjustSlideLinks()
  }, [])

  const settings: Settings = {
    afterChange: () => {
      adjustSlideLinks()
    },
    autoplay: false,
    centerMode: false,
    className:
      "[&_.slick-track]:flex [&_.slick-slider]:relative [&_.slick-slide>div]:h-full [&_.slick-slide>div>div]:h-full",
    dots: false,
    infinite: false,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToScroll: 1,
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
    ...slideshowProps,
  }
  return (
    <div ref={slideShowRef} {...props} aria-roledescription="carousel" className={twMerge("relative", props.className)}>
      <Slider {...settings}>{children}</Slider>
    </div>
  )
}

export default Slideshow
