import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Link from "@components/elements/link"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BackToLink from "@components/elements/back-to-link"
import {twMerge} from "tailwind-merge"
import {ChevronRightIcon} from "@heroicons/react/24/outline"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookExcerptPage = async ({node, ...props}: Props) => {
  const ancillaryPages = await getBookAncillaryContents(node.id)
  if (!ancillaryPages.length) notFound()

  return (
    <BackToLink
      {...props}
      className={twMerge("centered", props.className)}
      href={node.path}
      title={node.title}
      childrenProps={{className: "rs-mt-4 centered"}}
      isArticle
    >
      <NodePageMetadata key={node.id} metatags={node.metatag} pageTitle={`${node.title}: Excerpts & More`} />
      <H1>
        Excerpts + more<span className="sr-only">&nbps;{node.title}</span>
      </H1>
      <div className="rs-mb-0 centered flex flex-col md:flex-row md:gap-[17.1rem]">
        <div className="centered flex-grow lg:max-w-[900px]">
          <div className="type-2 font-medium xl:text-[3.3rem]">{node.title}</div>

          {node.supBookSubtitle && <div className="type-1 mt-5 font-medium xl:text-26">{node.supBookSubtitle}</div>}

          {node.supBookAuthorsFull && (
            <div className="rs-mb-4 type-0 mt-5 text-press-sand-dark xl:text-21">{node.supBookAuthorsFull}</div>
          )}

          {ancillaryPages.map(page => (
            <Link
              className="group rs-p-1 rs-mb-3 flex items-center gap-3 border text-stone-dark no-underline shadow last:mb-0 hocus:underline"
              key={page.id}
              href={page.path}
            >
              {page.title}
              <ChevronRightIcon
                width={24}
                className="shrink-0 text-digital-red transition-all group-hocus-visible:translate-x-2"
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
