import Link from "next/link"
import React, {ElementType, HTMLAttributes, HtmlHTMLAttributes, ReactNode} from "react"
import {ArrowLongLeftIcon} from "@heroicons/react/24/outline"
import {getLinkHref} from "@components/elements/link"
import cn from "@lib/utils/className"

type BackToLinkProps = Omit<HtmlHTMLAttributes<HTMLDivElement>, "title"> & {
  isArticle?: boolean
  childrenProps?: HTMLAttributes<HTMLDivElement>
  linkClasses?: string
  href: string
  title?: ReactNode
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
    <Wrapper {...props} className={cn("flex flex-col", props.className)}>
      <div {...childrenProps}>{children}</div>
      <Link
        href={getLinkHref(href)}
        prefetch={false}
        className={cn(
          "group order-first flex w-fit items-center gap-12.5 rs-pt-1 font-normal text-stone-dark no-underline md:gap-15 hocus:text-archway-dark hocus:underline",
          linkClasses
        )}
      >
        <ArrowLongLeftIcon
          width={25}
          className="text-stone-dark transition-all group-hocus:text-archway-dark group-hocus-visible:-translate-x-5"
        />
        <span className="text-18">Back to {title}</span>
      </Link>
    </Wrapper>
  )
}

export default BackToLink
