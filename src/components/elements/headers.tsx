import {HtmlHTMLAttributes} from "react"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLHeadingElement>

const headingLinkClasses = "[&_a]:hocus:underline"

export const H1 = ({children, className, ...props}: Props) => {
  return (
    <h1
      {...props}
      className={twMerge("rs-mb-5 font-medium", className?.includes("type-") ? className : ["type-3", className])}
    >
      {children}
    </h1>
  )
}

export const H2 = ({children, className, ...props}: Props) => {
  return (
    <h2
      {...props}
      className={twMerge(
        headingLinkClasses,
        "font-medium",
        className?.includes("type-") ? className : ["type-2", className]
      )}
    >
      {children}
    </h2>
  )
}

export const H3 = ({children, className, ...props}: Props) => {
  return (
    <h3
      {...props}
      className={twMerge(
        headingLinkClasses,
        "font-medium",
        className?.includes("type-") ? className : ["type-1", className]
      )}
    >
      {children}
    </h3>
  )
}

export const H4 = ({children, className, ...props}: Props) => {
  return (
    <h4
      {...props}
      className={twMerge(
        headingLinkClasses,
        "font-bold",
        className?.includes("type-") ? className : ["type-0", className]
      )}
    >
      {children}
    </h4>
  )
}

export const H5 = ({children, className, ...props}: Props) => {
  return (
    <h5
      {...props}
      className={twMerge(
        headingLinkClasses,
        "font-medium",
        className?.includes("type-") ? className : ["type-0", className]
      )}
    >
      {children}
    </h5>
  )
}

export const H6 = ({children, className, ...props}: Props) => {
  return (
    <h6
      {...props}
      className={twMerge(
        headingLinkClasses,
        "font-medium",
        className?.includes("type-") ? className : ["type-0", className]
      )}
    >
      {children}
    </h6>
  )
}

type HeadingProps = Props & {
  /**
   * Which heading level to display.
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Heading = ({children, level = 1, ...props}: HeadingProps) => {
  switch (level) {
    case 1:
      return <H1 {...props}>{children}</H1>
    case 2:
      return <H2 {...props}>{children}</H2>
    case 3:
      return <H3 {...props}>{children}</H3>
    case 4:
      return <H4 {...props}>{children}</H4>
    case 5:
      return <H5 {...props}>{children}</H5>
    case 6:
      return <H6 {...props}>{children}</H6>
  }
}
export default Heading
