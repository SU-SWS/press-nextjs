import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import SupBookCard from "@components/nodes/cards/sup-book/sup-book-card"
import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {JSX, Suspense} from "react"
import PagedList from "@components/elements/paged-list"

type Props = {
  /**
   * List of nodes to display.
   */
  items: NodeSupBook[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
  /**
   * Server action to load a page.
   */
  loadPage?: (_page: number) => Promise<JSX.Element>
}

const BookListView = ({items, totalItems, headingLevel, loadPage}: Props) => {
  const numItems = items.length

  return (
    <Suspense fallback={<BookListSkeleton />}>
      <PagedList
        ulProps={{
          className: twMerge(
            "list-unstyled grid @lg:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4 gap-20",
            clsx({
              "max-w-1200 mx-auto": numItems < 5,
              "@10xl:grid-cols-5": numItems >= 5,
            })
          ),
        }}
        totalPages={Math.ceil(totalItems / 30)}
        loadPage={loadPage}
      >
        {items.map(item => (
          <SupBookCard
            key={item.id}
            node={item}
            headingLevel={headingLevel}
          />
        ))}
      </PagedList>
    </Suspense>
  )
}

const BookListSkeleton = () => {
  return (
    <div className="grid gap-20 @lg:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4">
      {[1, 2, 3, 4].map(item => (
        <div
          key={`book-list-skeleton-${item}`}
          className="mx-auto min-w-72 max-w-3xl"
        >
          <div className="relative">
            <div className="rs-mb-1 relative aspect-[2/3] w-full bg-black-10 bg-opacity-50" />

            <div className="mb-5 h-[30px] bg-black-10 bg-opacity-50" />
          </div>

          <div className="rs-mb-3 h-[100px] bg-black-10 bg-opacity-50" />

          <div className="mb-0 h-[30px] bg-black-10 bg-opacity-50" />
        </div>
      ))}
    </div>
  )
}

export default BookListView
