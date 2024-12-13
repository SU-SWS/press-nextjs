import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import {HTMLAttributes} from "react"
import BookPage from "@components/nodes/pages/sup-book/book-page/book-page"
import DigitalProjectPage from "@components/nodes/pages/sup-book/digital-project-page/digital-project-page"
import AlgoliaRelatedBooks from "@components/algolia-search/algolia-related-books"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = async ({node, ...props}: Props) => {
  if (node.supBookType !== "book") return <DigitalProjectPage node={node} {...props} />

  return (
    <div>
      <NodePageMetadata metatags={node.metatag} pageTitle={node.title} backupDescription={node.supBookSubtitle}>
        {node.supBookAuthors?.map(author => (
          <>
            <meta property="book:author:profile:first_name" content={author.given || undefined} />
            <meta property="book:author:profile:last_name" content={author.family || undefined} />
          </>
        ))}
      </NodePageMetadata>
      <BookPage node={node} {...props} />
      <AlgoliaRelatedBooks objectId={node.id} />
    </div>
  )
}
export default SupBookPage
