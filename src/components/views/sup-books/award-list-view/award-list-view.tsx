import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import SupBookCard from "@components/nodes/cards/sup-book/sup-book-card"
import AwardListViewClient from "@components/views/sup-books/award-list-view/award-list-view.client"
import {ViewDisplayProps} from "@components/views/view"

const AwardListView = ({items, totalItems, headingLevel, loadPage}: ViewDisplayProps<NodeSupBook>) => {
  return (
    <AwardListViewClient totalItems={totalItems} loadPage={loadPage}>
      {items.map(item => (
        <SupBookCard key={item.id} node={item} headingLevel={headingLevel} />
      ))}
    </AwardListViewClient>
  )
}

export default AwardListView
