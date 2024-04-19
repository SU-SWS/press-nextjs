import {HtmlHTMLAttributes} from "react";
import {ParagraphSupPreBuilt} from "@lib/gql/__generated__/drupal.d";
import PrebuiltSearchForm from "@components/paragraphs/sup-pre-built/pre-built-search-form";
import PreBuiltAuthorList from "@components/paragraphs/sup-pre-built/pre-built-author-list";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupPreBuilt
}

const PreBuiltParagraph = ({paragraph, ...props}: Props) => {
  switch (paragraph.supPrebuiltComponent) {
    case "search_form":
      return <PrebuiltSearchForm {...props}/>
    case "book_author_list":
      return <PreBuiltAuthorList {...props}/>
  }
  console.warn(`Unknown prebuilt component ${paragraph.supPrebuiltComponent}`)
}
export default PreBuiltParagraph