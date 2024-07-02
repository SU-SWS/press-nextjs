import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {HTMLAttributes} from "react"
import BookPage from "@components/nodes/pages/sup-book/book-page/book-page"
import DigitalProjectPage from "@components/nodes/pages/sup-book/digital-project-page/digital-project-page"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = async ({node, ...props}: Props) => {
  return node.supBookType === "book" ? (
    <BookPage
      node={node}
      {...props}
    />
  ) : (
    <DigitalProjectPage
      node={node}
      {...props}
    />
  )
}
export default SupBookPage
