import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import SupBookCard from "@components/nodes/cards/sup-book/sup-book-card"
import {JSX} from "react"
import AwardListViewClient from "@components/views/sup-books/award-list-view/award-list-view.client"

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

const AwardListView = ({items, totalItems, headingLevel, loadPage}: Props) => {
  return (
    <AwardListViewClient totalItems={totalItems} loadPage={loadPage}>
      {items.map(item => (
        <SupBookCard key={item.id} node={item} headingLevel={headingLevel} />
      ))}
    </AwardListViewClient>
  )
}

export default AwardListView
