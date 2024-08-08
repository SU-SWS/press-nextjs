import {NodeSupBookAncillary} from "@lib/gql/__generated__/drupal"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Rows from "@components/paragraphs/rows/rows"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BackToLink from "@components/elements/back-to-link"
import {twMerge} from "tailwind-merge"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBookAncillary
}

const SupBookAncillaryPage = async ({node, ...props}: Props) => {
  const book = node.supAncillaryBook
  return (
    <div {...props} className={twMerge("centered flex flex-col", props.className)}>
      <BackToLink
        href={book.path}
        linkClasses="flex w-fit items-center gap-5 pt-20"
        title={book.title}
        className="order-last mx-auto max-w-900 gap-10 pt-32"
        isArticle
      >
        <H1 className="mb-32">
          {book.title}: {node.title}
        </H1>
        <div className="mb-36 flex flex-col gap-20 md:flex-row">
          <div className="flex flex-col gap-10">
            {book.supBookSubtitle && <div className="type-2 font-medium">{book.supBookSubtitle}</div>}

            {book.supBookAuthorsFull && <div className="type-1 text-press-sand-dark">{book.supBookAuthorsFull}</div>}
          </div>

          {book.supBookImage?.mediaImage && (
            <div className="relative order-first w-full shrink-0 md:max-w-400">
              <BookPageImage node={book} />
            </div>
          )}
        </div>
        <Rows components={node.supAncillaryParagraphs} className="px-5" />
      </BackToLink>
    </div>
  )
}
export default SupBookAncillaryPage
