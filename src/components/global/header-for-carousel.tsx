"use client"

import usePageHasTopBanner from "@lib/hooks/usePageHasTopBanner"
import {HTMLAttributes} from "react"
import {twMerge} from "tailwind-merge"

const HeaderForCarousel = ({children, ...props}: HTMLAttributes<HTMLDivElement>) => {
  const pageHasBanner = usePageHasTopBanner()
  return (
    <div {...props} className={twMerge(props.className, pageHasBanner ? "lg:bg-black" : undefined)}>
      {children}
    </div>
  )
}
export default HeaderForCarousel
