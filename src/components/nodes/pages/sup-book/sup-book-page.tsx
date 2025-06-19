import {NodeInterface, NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import {HTMLAttributes} from "react"
import BookPage from "@components/nodes/pages/sup-book/book-page/book-page"
import DigitalProjectPage from "@components/nodes/pages/sup-book/digital-project-page/digital-project-page"
import AlgoliaRelatedBooks from "@components/algolia-search/algolia-related-books"
import {H2} from "@components/elements/headers"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import SupBookCard from "@components/nodes/cards/sup-book/sup-book-card"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = async ({node, ...props}: Props) => {
  if (node.supBookType !== "book") return <DigitalProjectPage node={node} {...props} />

  return (
    <div>
      <BookPage node={node} {...props} />
      {node.supBookRelatedTitles && node.supBookRelatedTitles.length > 0 && (
        <section aria-labelledby={`${node.id}-related`} className="centered mt-64 border-t-2 border-press-sand-dark">
          <H2 id={`${node.id}-related`} className="mb-32 mt-16 font-medium text-stone-dark">
            Explore more
          </H2>
          <ul className="list-unstyled mx-auto grid w-11/12 grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {node.supBookRelatedTitles.slice(0, 5).map(relatedBook => (
              <RelatedBook key={relatedBook.id} path={relatedBook.path} />
            ))}
          </ul>
        </section>
      )}
      {!node.supBookRelatedTitles && <AlgoliaRelatedBooks objectId={node.id} />}
    </div>
  )
}

const RelatedBook = async ({path}: {path: NodeInterface["path"]}) => {
  if (!path) return
  const {entity} = await getEntityFromPath<NodeSupBook>(path)
  if (!entity) return
  return (
    <li className="mx-auto w-full max-w-3xl">
      <SupBookCard node={entity} />
    </li>
  )
}

export default SupBookPage
