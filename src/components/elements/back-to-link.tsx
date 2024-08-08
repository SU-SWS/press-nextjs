import Link from "next/link"
import React from "react"
import {ArrowLongLeftIcon} from "@heroicons/react/24/outline"
import {twMerge} from "tailwind-merge"

interface BackToLinkProps {
  className?: string
  href: string
  title?: string
}

const BackToLink = ({className, href, title = "Books"}: BackToLinkProps) => {
  return (
    <Link
      href={href}
      className={twMerge(
        "group rs-pt-1 flex w-fit items-center gap-5 font-normal text-stone-dark no-underline hocus:text-archway-dark hocus:underline md:gap-6",
        className
      )}
    >
      <ArrowLongLeftIcon width={25} className="text-stone-dark group-hocus:text-archway-dark" />
      <span className="text-18">Back to {title}</span>
    </Link>
  )
}

export default BackToLink
