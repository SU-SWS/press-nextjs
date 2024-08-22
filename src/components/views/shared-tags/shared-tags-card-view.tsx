import CardViewGrid from "@components/views/card-view-grid"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"

interface Props {
  /**
   * List of node entities.
   */
  items: NodeUnion[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
  /**
   * Total number of items on all pages.
   */
  totalItems: number
}

const SharedTagsCardView = async ({items = [], headingLevel, totalItems}: Props) => {
  return <CardViewGrid items={items} headingLevel={headingLevel} totalItems={totalItems} />
}
export default SharedTagsCardView
