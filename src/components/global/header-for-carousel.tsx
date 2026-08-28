"use client"

import usePageHasTopBanner from "@lib/hooks/usePageHasTopBanner"
import {HTMLAttributes} from "react"
import cn from "@lib/utils/className"

const HeaderForCarousel = ({children, ...props}: HTMLAttributes<HTMLDivElement>) => {
  const pageHasBanner = usePageHasTopBanner()
  return (
    <div {...props} className={cn(props.className, pageHasBanner ? "lg:bg-black" : undefined)}>
      {children}
    </div>
  )
}
export default HeaderForCarousel
