import {NodeSupBookAncillary} from "@lib/gql/__generated__/drupal"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Rows from "@components/paragraphs/rows/rows"
import Link from "@components/elements/link"
import {ArrowLeftIcon} from "@heroicons/react/16/solid"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBookAncillary
}

const SupBookAncillaryPage = async ({node, ...props}: Props) => {
  const book = node.supAncillaryBook
  return (
    <div className="centered flex flex-col">
      <article className="order-last mx-auto max-w-900 gap-10 pt-32" {...props}>
        <H1 className="mb-32">
          {book.title}: {node.title}
        </H1>
        <div className="mb-36 flex flex-col gap-20 md:flex-row">
          <div className="flex flex-col gap-10">
            {book.supBookSubtitle && <div className="type-4 font-medium">{book.supBookSubtitle}</div>}

            {book.supBookAuthorsFull && <div className="type-3 text-press-sand-dark">{book.supBookAuthorsFull}</div>}
          </div>

          {book.supBookImage?.mediaImage && (
            <div className="relative order-first w-full shrink-0 md:max-w-400">
              <BookPageImage node={book} />
            </div>
          )}
        </div>
        <Rows components={node.supAncillaryParagraphs} className="px-5" />
      </article>

      <Link href={book.path} className="flex w-fit items-center gap-5 pt-20">
        <ArrowLeftIcon width={20} className="text-fog-dark" />
        <span>Back to {book.title}</span>
      </Link>
    </div>
  )
}
export default SupBookAncillaryPage
