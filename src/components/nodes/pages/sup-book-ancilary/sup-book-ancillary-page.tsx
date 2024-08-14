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
    <BackToLink
      {...props}
      href={book.path + "/excerpts"}
      className={twMerge("centered", props.className)}
      linkClasses="flex w-fit items-center gap-5 pt-20"
      title="Excerpts + More"
      childrenProps={{className: "rs-mt-4 order-last mx-auto max-w-900 gap-10"}}
      isArticle
    >
      <H1 className="mb-32">
        {node.title} for {book.title}
      </H1>
      <div className="mb-36 flex flex-col gap-20 md:flex-row">
        <div className="flex flex-col gap-5">
          {node.supAncillaryBook.supBookSubtitle && (
            <div className="type-2 font-medium">{node.supAncillaryBook.supBookSubtitle}</div>
          )}

          {node.supAncillaryBook.supBookAuthorsFull && (
            <div className="type-1 text-press-sand-dark">{node.supAncillaryBook.supBookAuthorsFull}</div>
          )}
        </div>

        {node.supAncillaryBook.supBookImage?.mediaImage && (
          <div className="relative order-first w-full shrink-0 md:max-w-200">
            <BookPageImage node={node.supAncillaryBook} />
          </div>
        )}
      </div>
      <Rows components={node.supAncillaryParagraphs} className="px-5" />
    </BackToLink>
  )
}
export default SupBookAncillaryPage
