import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordFaq} from "@lib/gql/__generated__/drupal.d"
import {H2} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Accordion from "@components/elements/accordion"
import twMerge from "@lib/utils/twMergeConfig"
import ExpandCollapseAll from "@components/paragraphs/stanford-faq/expand-collapse-all"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordFaq
}

const FaqParagraph = ({paragraph, ...props}: Props) => {
  return (
    <div {...props} className={twMerge("mx-auto max-w-1200 space-y-20", props.className)}>
      <div className="flex items-center justify-between gap-20">
        {paragraph.suFaqHeadline && <H2>{paragraph.suFaqHeadline}</H2>}

        <ExpandCollapseAll className="ml-auto" />
      </div>
      <Wysiwyg html={paragraph.suFaqDescription?.processed} />

      <div>
        {paragraph.suFaqQuestions?.map(question => (
          <Accordion
            className="border-t border-black-40 last:border-b"
            buttonProps={{className: "mt-6"}}
            key={question.id}
            button={question.suAccordionTitle}
            headingLevel={paragraph.suFaqHeadline ? "h3" : "h2"}
          >
            <Wysiwyg html={question.suAccordionBody.processed} />
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default FaqParagraph
