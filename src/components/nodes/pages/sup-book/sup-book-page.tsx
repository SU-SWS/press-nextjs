import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {HTMLAttributes} from "react"
import BookPage from "@components/nodes/pages/sup-book/book-page/book-page"
import DigitalProjectPage from "@components/nodes/pages/sup-book/digital-project-page/digital-project-page"
import AlgoliaRelatedBooks from "@components/algolia-search/algolia-related-books"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = async ({node, ...props}: Props) => {
  if (node.supBookType !== "book") return <DigitalProjectPage node={node} {...props} />

  return (
    <>
      <BookPage node={node} {...props} />
      <AlgoliaRelatedBooks objectId={node.id} />
    </>
  )
}
export default SupBookPage
