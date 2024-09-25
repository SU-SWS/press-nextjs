import Link from "next/link"
import React, {ElementType, HTMLAttributes, HtmlHTMLAttributes} from "react"
import {ArrowLongLeftIcon} from "@heroicons/react/24/outline"
import {twMerge} from "tailwind-merge"

type BackToLinkProps = HtmlHTMLAttributes<HTMLDivElement> & {
  isArticle?: boolean
  childrenProps?: HTMLAttributes<HTMLDivElement>
  linkClasses?: string
  href: string
  title?: string
}

const BackToLink = ({
  isArticle,
  children,
  childrenProps,
  linkClasses,
  href,
  title = "Books",
  ...props
}: BackToLinkProps) => {
  const Wrapper: ElementType = isArticle ? "article" : "div"
  return (
    <Wrapper {...props} className={twMerge("flex flex-col", props.className)}>
      <div {...childrenProps}>{children}</div>
      <Link
        href={href}
        className={twMerge(
          "group rs-pt-1 order-first flex w-fit items-center gap-5 font-normal text-stone-dark no-underline hocus:text-archway-dark hocus:underline md:gap-6",
          linkClasses
        )}
      >
        <ArrowLongLeftIcon
          width={25}
          className="text-stone-dark transition-all group-hocus:text-archway-dark group-hocus-visible:-translate-x-2"
        />
        <span className="text-18">Back to {title}</span>
      </Link>
    </Wrapper>
  )
}

export default BackToLink
