import {HtmlHTMLAttributes} from "react"
import Link from "next/link"
import {EnvelopeIcon} from "@heroicons/react/24/outline"
import ActionLink from "@components/elements/action-link"
import Button from "@components/elements/button"
import {LinkProps as NextLinkProps} from "next/dist/client/link"

export type LinkProps = HtmlHTMLAttributes<HTMLAnchorElement | HTMLButtonElement> &
  NextLinkProps & {
    /**
     * Link URL.
     */
    href: string
  }

const DrupalLink = ({href, children, ...props}: LinkProps) => {
  // Make sure all links have a href.
  href = href || "#"
  const drupalBase: string = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "").replace(/\/$/, "")

  // Make sure links to documents or images go to the Drupal origin.
  if (href.startsWith("/") && href.includes("/files/")) {
    href = `${drupalBase}${href}`
  }

  // For links not to the file system, make them relative and replace <front>.
  if (!href.includes("/files/")) {
    href = href.replace(drupalBase, "").replace("<front>", "/")
  }

  if (props.className?.includes("link--action")) {
    return (
      <ActionLink href={href} {...props}>
        {children}
      </ActionLink>
    )
  }

  if (props.className?.includes("button")) {
    return (
      <Button
        {...props}
        href={href}
        big={props.className.includes("--big")}
        secondary={props.className.includes("--secondary")}
      >
        {children}
      </Button>
    )
  }

  return (
    <Link {...props} href={href}>
      {children}
      {href.startsWith("mailto") && <EnvelopeIcon width={20} className="ml-4 inline-block" />}
    </Link>
  )
}

export default DrupalLink as typeof Link
