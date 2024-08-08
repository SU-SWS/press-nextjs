import Link from "next/link"
import React, {ElementType, HtmlHTMLAttributes} from "react"
import {ArrowLongLeftIcon} from "@heroicons/react/24/outline"
import {twMerge} from "tailwind-merge"

type BackToLinkProps = HtmlHTMLAttributes<HTMLDivElement> & {
  isArticle?: boolean
  linkClasses?: string
  href: string
  title?: string
}

const BackToLink = ({isArticle, children, linkClasses, href, title = "Books", ...props}: BackToLinkProps) => {
  const Wrapper: ElementType = isArticle ? "article" : "div"
  return (
    <>
      <Wrapper {...props} className={twMerge("order-last", props.className)}>
        {children}
      </Wrapper>
      <Link
        href={href}
        className={twMerge(
          "group rs-pt-1 flex w-fit items-center gap-5 font-normal text-stone-dark no-underline hocus:text-archway-dark hocus:underline md:gap-6",
          linkClasses
        )}
      >
        <ArrowLongLeftIcon width={25} className="text-stone-dark group-hocus:text-archway-dark" />
        <span className="text-18">Back to {title}</span>
      </Link>
    </>
  )
}

export default BackToLink
