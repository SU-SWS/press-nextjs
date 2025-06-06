import parse, {HTMLReactParserOptions, Element, domToReact, attributesToProps, DOMNode} from "html-react-parser"
import Image from "next/image"
import Oembed from "@components/elements/ombed"
import React, {ComponentProps, HtmlHTMLAttributes} from "react"
import {H2, H3, H4, H5, H6} from "@components/elements/headers"
import {twMerge} from "tailwind-merge"
import {Maybe} from "@lib/gql/__generated__/drupal.d"
import Mathjax from "@components/tools/mathjax"
import Script from "next/script"
import Button from "@components/elements/button"
import ActionLink from "@components/elements/action-link"
import clsx from "clsx"
import Link from "@components/elements/link"
import Blockquote from "@components/elements/blockquote"
import Iframe from "@components/elements/iframe"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * HTML string.
   */
  html?: Maybe<string>
}

const Wysiwyg = ({html, className, ...props}: Props) => {
  if (!html) return
  // Remove comments and empty lines.
  html = html.replaceAll(/<!--[\s\S]*?-->/g, "").replaceAll(/(^(\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm, "")

  const addMathJax = html.match(/\$\$.*\$\$/) || html.match(/\\\[.*\\\]/) || html.match(/\\\(.*\\\)/)
  return (
    <div
      className={twMerge(
        "[&_a]:not(.btn):text-digital-red hocus:[&_a]:not(.btn):text-archway-dark wysiwyg leading",
        className
      )}
      {...props}
    >
      {addMathJax && <Mathjax />}
      {formatHtml(html)}
    </div>
  )
}

const options: HTMLReactParserOptions = {
  replace: domNode => {
    if (domNode instanceof Element) {
      const nodeProps = attributesToProps(domNode.attribs)
      nodeProps.className = fixClasses(nodeProps.className)
      const NodeName = domNode.name as React.ElementType
      const children: DOMNode[] = domNode.children as DOMNode[]

      switch (domNode.name) {
        case "a":
          // No href for a link, change it to a span tag and keep all other attributes.
          if (!nodeProps.href) {
            return <span {...nodeProps}>{domToReact(children, options)}</span>
          }

          if (nodeProps.className?.includes("link--action")) {
            return (
              <ActionLink {...nodeProps} href={nodeProps.href as string} prefetch={false}>
                {domToReact(children, options)}
              </ActionLink>
            )
          }

          if (nodeProps.className?.includes("button")) {
            return (
              <Button
                {...nodeProps}
                prefetch={false}
                big={nodeProps.className.includes("button--big")}
                secondary={nodeProps.className.includes("button--secondary")}
              >
                {domToReact(children, options)}
              </Button>
            )
          }

          nodeProps.className = twMerge(nodeProps.className, "text-digital-red hocus:text-archway-dark")
          return (
            <Link href={nodeProps.href as string} prefetch={false} {...nodeProps}>
              {domToReact(children, options)}
            </Link>
          )

        case "div":
        case "article":
          delete nodeProps.role
          if (nodeProps.className?.includes("media-entity-wrapper")) {
            return cleanMediaMarkup(domNode)
          }
          if (nodeProps.className?.includes("trigger")) {
            return <></>
          }

          if (nodeProps.className?.includes("chapnumandtitle")) {
            nodeProps.className += " font-semibold type-3 xl:text-[4.1rem]"
          }

          return <NodeName {...nodeProps}>{domToReact(children, options)}</NodeName>

        case "figure":
          return cleanMediaMarkup(domNode)

        case "p":
          if (nodeProps?.className.includes("blockquote")) {
            return <Blockquote>{domToReact(children, options)}</Blockquote>
          }
          nodeProps.className = twMerge(
            nodeProps.className,
            "max-w-[100ch]",
            clsx({"type-0 xl:text-21": !nodeProps.className.includes("type-")})
          )
          return <NodeName {...nodeProps}>{domToReact(children, options)}</NodeName>

        case "blockquote":
          return <Blockquote>{domToReact(children, options)}</Blockquote>

        case "script":
          return <Script {...nodeProps}>{domToReact(children, options)}</Script>

        case "h2":
          return <H2 {...nodeProps}>{domToReact(children, options)}</H2>
        case "h3":
          return <H3 {...nodeProps}>{domToReact(children, options)}</H3>
        case "h4":
          return <H4 {...nodeProps}>{domToReact(children, options)}</H4>
        case "h5":
          return <H5 {...nodeProps}>{domToReact(children, options)}</H5>
        case "h6":
          return <H6 {...nodeProps}>{domToReact(children, options)}</H6>

        case "hr":
          nodeProps.className = twMerge(nodeProps.className, "border-t border-press-sand-light")
          return <hr {...nodeProps} />

        case "iframe":
          return <Iframe {...nodeProps}></Iframe>

        default:
          return null
      }
    }
  },
}

const fixClasses = (classes?: string | boolean): string => {
  if (!classes) return ""
  // Pad the classes so that we can easily replace a whole class instead of parts of them.
  classes = ` ${classes} `

  classes = classes
    .replaceAll(" su-", " ")
    .replaceAll(" text-align-center ", " text-center *:mx-auto ")
    .replace(" text-align-right ", " text-right ")
    .replaceAll(" align-center ", " mx-auto ")
    .replaceAll(" align-left ", " float-left mr-10 mb-10 ")
    .replaceAll(" align-right ", " float-right ml-10 mb-10 ")
    .replaceAll(" visually-hidden ", " sr-only ")
    .replaceAll(" font-splash ", " splash-text type-4 xl:text-[5.1rem] ")
    .replaceAll(" callout-text ", " font-bold type-3 xl:text-[4.1rem] ")
    .replaceAll(" related-text ", " shadow-lg border border-black-20 p-16 ")
    .replaceAll(
      " drop-cap ",
      " type-2 xl:text-[3.3rem] first-letter:font-bold first-letter:type-6 first-letter:float-left first-letter:my-2 first-letter:mr-4 "
    )
    .replaceAll(" intro-text ", " type-1 xl:text-26 ")
    .replace(/ tablesaw.*? /g, " ")
    .replace(/ +/g, " ")
    .trim()

  classes = classes
    .split(" ")
    .filter(className => className.trim().length >= 1)
    .join(" ")

  return twMerge(classes.trim())
}

const cleanMediaMarkup = (node: Element) => {
  const nodeProps = attributesToProps(node.attribs)
  nodeProps.className = fixClasses(nodeProps.className)

  const getImage = (node: Element): ComponentProps<"img"> | undefined => {
    let img
    if (node.name === "img") {
      const attribs = node.attribs
      attribs.width = attribs.width || attribs["data-width"]
      attribs.height = attribs.height || attribs["data-height"]
      return attribs
    }
    if (node.children.length > 0) {
      let child
      for (child of node.children) {
        if (child instanceof Element) {
          img = getImage(child)
          if (img) return img
        }
      }
    }
  }
  const getFigCaption = (node: Element): DOMNode[] | undefined => {
    let caption
    if (node.name === "figcaption") {
      return node.children as DOMNode[]
    }
    if (node.children.length > 0) {
      let child
      for (child of node.children) {
        if (child instanceof Element) {
          caption = getFigCaption(child)
          if (caption) return caption
        }
      }
    }
  }

  const getOembedUrl = (node: Element): string | undefined => {
    const src = node.attribs?.src || node.attribs["data-src"]
    if (src?.includes("/media/oembed")) {
      return decodeURIComponent(src).replace(/^.*url=(.*)?&.*$/, "$1")
    }
    if (node.children.length > 0) {
      let child
      for (child of node.children) {
        if (child instanceof Element) {
          const url: string | undefined = getOembedUrl(child)
          if (url) return url
        }
      }
    }
  }

  // Special handling of Oembeds
  const oembedUrl = getOembedUrl(node)
  if (oembedUrl) {
    return <Oembed url={oembedUrl} />
  }

  const image = getImage(node)
  if (image) {
    let {src} = image
    const {alt, width, height} = image
    if (!src || typeof src !== "string") return

    if (src?.startsWith("/")) {
      src = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string) + src
    }
    const figCaption = getFigCaption(node)

    if (figCaption) {
      nodeProps.className = twMerge("table", nodeProps.className)
      if (nodeProps.className?.includes("mx-auto")) nodeProps.className += " w-full"
      delete nodeProps.role
      return (
        <figure {...nodeProps}>
          <WysiwygImage src={src} alt={alt} height={height} width={width} />
          <figcaption className="table-caption caption-bottom text-center">
            {domToReact(figCaption, options)}
          </figcaption>
        </figure>
      )
    }

    return <WysiwygImage src={src} alt={alt} height={height} width={width} {...nodeProps} />
  }
  return <div {...nodeProps}>{domToReact(node.children as DOMNode[], options)}</div>
}

const WysiwygImage = ({
  src,
  alt,
  height,
  width,
  className,
}: {
  src: string
  alt?: Maybe<string>
  height?: Maybe<string | number>
  width?: Maybe<string | number>
  className?: string
}) => {
  if (width && height) {
    return (
      <Image
        className={twMerge(fixClasses(className), "mb-10")}
        src={src.trim()}
        alt={alt ? alt.trim() : ""}
        height={parseInt(`${height}`)}
        width={parseInt(`${width}`)}
      />
    )
  }
  return (
    <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden">
      <Image
        className="object-cover object-center"
        src={src.trim()}
        alt={alt?.trim() || ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 900px) 50vw, (max-width: 1700px) 33vw, 1500px"
      />
    </div>
  )
}

const formatHtml = (html: string) => parse(html || "", options)

export default Wysiwyg
