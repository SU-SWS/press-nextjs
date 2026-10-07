import {Maybe, ParagraphStanfordWysiwyg, ParagraphUnion} from "@lib/gql/__generated__/graphql"
import {decode} from "html-entities"

export const getFirstText = (components?: Maybe<ParagraphUnion[]>) => {
  const firstWysiwyg = components?.find(
    component => component.__typename === "ParagraphStanfordWysiwyg"
  ) as ParagraphStanfordWysiwyg
  if (firstWysiwyg) {
    return getCleanDescription(firstWysiwyg.suWysiwygText?.processed)
  }
}

export const getCleanDescription = (description: Maybe<string> | undefined): string | undefined => {
  if (description) {
    const text: string =
      description
        .replace(/(<([^>]+)>)/gi, " ")
        .replace("/ +/", " ")
        .split(".")
        .slice(0, 1)
        .join(".") + "."
    return text?.length > 1 ? decode(text).trim() : undefined
  }
}
