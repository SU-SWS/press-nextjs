import Paragraph from "@components/paragraphs/paragraph"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"

const OneColumn = ({items}: {items: ParagraphUnion[]}) => {
  return (
    <div className="space-y-16" data-columns="1">
      {items.map(item => (
        <Paragraph paragraph={item} key={item.id} />
      ))}
    </div>
  )
}
export default OneColumn
