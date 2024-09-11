import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Rows from "@components/paragraphs/rows/rows"
import Link from "@components/elements/link"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BackToLink from "@components/elements/back-to-link"
import {twMerge} from "tailwind-merge"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookExcerptPage = async ({node, ...props}: Props) => {
  const ancillaryPages = await getBookAncillaryContents(node.id, node.path)
  const hasExcerptAndMore = node.supBookExcerpts || !!ancillaryPages.length
  if (!hasExcerptAndMore) notFound()

  return (
    <BackToLink
      {...props}
      className={twMerge("centered", props.className)}
      href={node.path}
      title={node.title}
      childrenProps={{className: "rs-mt-4 mx-auto max-w-900 gap-10"}}
      isArticle
    >
      <H1>
        Excerpts + More<span className="sr-only">&nbps;{node.title}</span>
      </H1>
      <div className="rs-mb-0 flex flex-col md:flex-row">
        <div className="flex flex-col md:rs-ml-1">
          <div className="type-2 font-medium xl:text-[3.3rem]">{node.title}</div>

          {node.supBookSubtitle && <div className="type-1 mt-5 font-medium xl:text-26">{node.supBookSubtitle}</div>}

          {node.supBookAuthorsFull && (
            <div className="type-0 mt-5 text-press-sand-dark xl:text-21">{node.supBookAuthorsFull}</div>
          )}

          {ancillaryPages.map(page => (
            <Link className="rs-pt-1 rs-mt-2 border-t-2 border-fog" key={page.id} href={page.path}>
              {page.title}
            </Link>
          ))}
        </div>

        {node.supBookImage?.mediaImage && (
          <div className="relative order-first w-full max-w-[16rem] shrink-0">
            <BookPageImage node={node} />
          </div>
        )}
      </div>
      <Rows components={node.supBookExcerpts} className="px-5" />
    </BackToLink>
  )
}

export default SupBookExcerptPage
