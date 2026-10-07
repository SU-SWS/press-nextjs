import {NodeSupBook} from "@lib/gql/__generated__/graphql"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Link from "@components/elements/link"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BackToLink from "@components/elements/back-to-link"
import cn from "@lib/utils/className"
import {ChevronRightIcon} from "@heroicons/react/24/outline"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {formatHtml} from "@components/elements/wysiwyg"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookExcerptPage = async ({node, ...props}: Props) => {
  const ancillaryPages = await getBookAncillaryContents(node.uuid)
  if (!ancillaryPages.length) notFound()

  return (
    <BackToLink
      {...props}
      className={cn("centered", props.className)}
      href={node.path || "#"}
      title={formatHtml(node.title)}
      childrenProps={{className: "rs-mt-4 centered"}}
      isArticle
    >
      <NodePageMetadata key={node.uuid} metatags={node.metatag} pageTitle={`${node.title}: Excerpts & More`} />
      <H1>
        Excerpts + more<span className="sr-only">&nbps;{formatHtml(node.title)}</span>
      </H1>
      <div className="centered rs-mb-0 flex flex-col md:flex-row md:gap-[17.1rem]">
        <div className="centered grow lg:max-w-[900px]">
          <div className="type-2 font-medium xl:text-[3.3rem]">{formatHtml(node.title)}</div>

          {node.supBookSubtitle && (
            <div className="mt-12.5 type-1 font-medium xl:text-26">{formatHtml(node.supBookSubtitle)}</div>
          )}

          {node.supBookAuthorsFull && (
            <div className="mt-12.5 rs-mb-4 type-0 text-press-sand-dark xl:text-21">{node.supBookAuthorsFull}</div>
          )}

          {ancillaryPages.map(page => (
            <Link
              className="group rs-mb-3 flex items-center gap-7.5 border rs-p-1 text-stone-dark no-underline shadow-sm last:mb-0 hocus:underline"
              key={page.uuid}
              href={page.path || "#"}
            >
              {page.title}
              <ChevronRightIcon
                width={24}
                className="shrink-0 text-digital-red transition-all group-hocus-visible:translate-x-5"
              />
            </Link>
          ))}
        </div>

        {node.supBookImage?.mediaImage && (
          <div className="relative order-first w-1/4 shrink-0">
            <BookPageImage node={node} />
          </div>
        )}
      </div>
    </BackToLink>
  )
}

export default SupBookExcerptPage
