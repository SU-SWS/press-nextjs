import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordSpacer} from "@lib/gql/__generated__/drupal.d"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordSpacer
}

const SpacerParagraph = ({paragraph, ...props}: Props) => {
  let h = "h-50"
  if (paragraph.suSpacerSize === "su-spacer-minimal") h = "h-25"
  if (paragraph.suSpacerSize === "su-spacer-reduced") h = ""
  return <div className={h} {...props}></div>
}
export default SpacerParagraph
