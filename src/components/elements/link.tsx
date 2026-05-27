import {HtmlHTMLAttributes} from "react"
import Link from "next/link"
import {EnvelopeIcon} from "@heroicons/react/24/outline"
import ActionLink from "@components/elements/action-link"
import Button from "@components/elements/button"
import {LinkProps as NextLinkProps} from "next/dist/client/link"
import twMerge from "@lib/utils/twMergeConfig"

export type LinkProps = HtmlHTMLAttributes<HTMLAnchorElement | HTMLButtonElement> &
  NextLinkProps & {
    /**
     * Link URL.
     */
    href: string
  }

export const getLinkHref = (href: string = "#") => {
  const drupalBase: string = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "").replace(/\/$/, "")

  if (href.match(/^\//)) href = `${drupalBase}${href}`

  // Make sure links to images go to the Drupal origin.
  if (href.match(/\/files\//)) {
    // Matches Drupal document file URLs for rewriting, but don't match other drupal sites.
    const reg = new RegExp(
      `${drupalBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sites/\\w+/files/.*\\.(txt|rtf|doc|docx|ppt|pptx|xls|xlsx|pdf|mp3|wav|epub)$`,
      "i"
    )

    // For document files, change Drupal urls to be relative. These will be "rewritten" using the next config.
    // @see https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites
    if (href.match(reg)) {
      // Remove the domain to make relative and adjust the path to something cleaner for rewriting.
      href = href.replace(drupalBase, "").replace("/files/", "/").replace("/sites/", "/files/")
    }
  } else {
    // For links not to the file system, make them relative and replace <front>.
    href = href.replace(drupalBase, "").replace("<front>", "/")
  }

  return href
}

const DrupalLink = ({href, children, ...props}: LinkProps) => {
  href = getLinkHref(href)

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
    <Link {...props} href={href} className={twMerge("group text-digital-red hocus:text-archway-dark", props.className)}>
      {children}
      {href.startsWith("mailto") && (
        <EnvelopeIcon width={20} className="ml-4 inline-block text-digital-red group-hocus:text-archway-dark" />
      )}
    </Link>
  )
}

export default DrupalLink as typeof Link
