import OneColumn from "@components/paragraphs/rows/one-column"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {twMerge} from "tailwind-merge"

export type TwoColumnConfig = Record<string, string>
type Props = {
  items: ParagraphUnion[]
  config?: TwoColumnConfig
}
const TwoColumn = ({items, config}: Props) => {
  const leftItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === "left")
  const rightItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region !== "left")

  let gridCols = "@6xl/rows:grid-cols-2"
  if (config?.column_widths === "33-67") {
    gridCols = "@6xl/rows:grid-cols-1-2"
  } else if (config?.column_widths === "67-33") {
    gridCols = "@6xl/rows:grid-cols-2-1"
  }

  return (
    <div className={twMerge("gutters grid gap-10 @6xl/rows:gap-20", gridCols)} data-columns="2">
      <OneColumn items={leftItems} />
      <OneColumn items={rightItems} />
    </div>
  )
}
export default TwoColumn
