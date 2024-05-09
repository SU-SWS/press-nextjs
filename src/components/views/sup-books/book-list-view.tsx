import {NodeSupBook} from "@lib/gql/__generated__/drupal";
import PagedList from "@components/elements/paged-list";
import SupBookCard from "@components/nodes/cards/sup-book/sup-book-card";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

type Props = {
  /**
   * List of nodes to display.
   */
  items: NodeSupBook[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
}

const BookListView = ({items, headingLevel}: Props) => {

  const numItems = items.length;
  return (
    <PagedList
      ulProps={{
        className: twMerge("list-unstyled grid @2xl:grid-cols-2 @6xl:grid-cols-3 gap-20", clsx({
          "max-w-1200 mx-auto": numItems < 5,
          "@10xl:grid-cols-5": numItems >= 5
        }))
      }} itemsPerPage={20}
    >
      {items.map(item =>
        <SupBookCard key={item.id} node={item} headingLevel={headingLevel}/>
      )}
    </PagedList>
  )
}

export default BookListView;