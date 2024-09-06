import {NodeSupBookAncillary} from "@lib/gql/__generated__/drupal"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Rows from "@components/paragraphs/rows/rows"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BackToLink from "@components/elements/back-to-link"
import {twMerge} from "tailwind-merge"
import Wysiwyg from "@components/elements/wysiwyg"

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
      linkClasses="flex w-fit items-center gap-5"
      title="Excerpts + More"
      childrenProps={{className: "rs-mt-4 mx-auto max-w-900 gap-10"}}
      isArticle
    >
      <H1 className="type-3 xl:text-[4.1rem]">
        {node.title} for <em>{book.title}</em>
      </H1>
      <div className="rs-mb-0 flex flex-col md:flex-row">
        <div className="rs-ml-1 flex flex-col">
          {node.supAncillaryBook.supBookSubtitle && (
            <div className="type-1 font-medium xl:text-26">{node.supAncillaryBook.supBookSubtitle}</div>
          )}

          {node.supAncillaryBook.supBookAuthorsFull && (
            <div className="type-0 mt-5 text-press-sand-dark xl:text-21">
              {node.supAncillaryBook.supBookAuthorsFull}
            </div>
          )}
        </div>

        {node.supAncillaryBook.supBookImage?.mediaImage && (
          <div className="relative order-first w-full max-w-[16rem] shrink-0">
            <BookPageImage node={node.supAncillaryBook} />
          </div>
        )}
      </div>

      <Wysiwyg html={node.body?.processed} />
      <Rows components={node.supAncillaryParagraphs} className="px-5" />
    </BackToLink>
  )
}
export default SupBookAncillaryPage
