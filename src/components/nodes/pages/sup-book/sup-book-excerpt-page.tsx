import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {H1, H2} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Rows from "@components/paragraphs/rows/rows"
import Link from "@components/elements/link"
import {ArrowLeftIcon} from "@heroicons/react/16/solid"
import Wysiwyg from "@components/elements/wysiwyg"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookExcerptPage = async ({node, ...props}: Props) => {
  const ancillaryPages = await getBookAncillaryContents(node.id)
  const hasExcerptAndMore = node.supBookExcerpts || node.supBookTableOfContents || !!ancillaryPages.length
  if (!hasExcerptAndMore) notFound()

  return (
    <div className="centered flex flex-col">
      <article className="order-last mx-auto max-w-900 gap-10 pt-32" {...props}>
        <H1 className="mb-32">Excerpts + More</H1>
        <div className="mb-36 flex flex-col gap-20 md:flex-row">
          <div className="flex flex-col gap-10">
            <div className="text-m4 font-medium">{node.title}</div>

            {node.supBookSubtitle && <div className="text-m3 font-medium">{node.supBookSubtitle}</div>}

            {node.supBookAuthorsFull && <div className="text-m2 text-press-sand-dark">{node.supBookAuthorsFull}</div>}

            {ancillaryPages.map(page => (
              <Link key={page.id} href={page.path}>
                {page.title}
              </Link>
            ))}
          </div>

          {node.supBookImage?.mediaImage && (
            <div className="relative order-first w-full shrink-0 md:max-w-400">
              <BookPageImage node={node} />
            </div>
          )}
        </div>
        <Rows components={node.supBookExcerpts} className="px-5" />

        {node.supBookTableOfContents && (
          <div className="centered lg:max-w-[980px]">
            <H2>Contents</H2>
            <Wysiwyg html={node.supBookTableOfContents.processed} />
          </div>
        )}
      </article>

      <Link href={node.path} className="flex w-fit items-center gap-5 pt-20">
        <ArrowLeftIcon width={20} className="text-fog-dark" />
        <span>Back to {node.title}</span>
      </Link>
    </div>
  )
}

export default SupBookExcerptPage
