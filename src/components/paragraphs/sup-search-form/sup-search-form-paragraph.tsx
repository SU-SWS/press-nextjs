import {HTMLAttributes, useId} from "react"
import {ParagraphSupSearchForm} from "@lib/gql/__generated__/graphql"
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid"

type Props = HTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupSearchForm
}

const SupSearchFormParagraph = ({paragraph, ...props}: Props) => {
  const inputId = useId()

  return (
    <div {...props}>
      <form className="mx-auto max-w-6xl" aria-label="Site Search" action="/search">
        <div className="mt-25 flex items-center gap-12.5">
          <label htmlFor={inputId} className="sr-only">
            Search all books by title, author, subject, keywords, or ISBNs
          </label>

          <input
            className="w-full border-0 border-b-2 border-stone pt-20 rs-pr-1 pb-25 rs-pl-1 card-paragraph placeholder:card-paragraph md:py-30 md:rs-pr-2 md:rs-pl-3"
            type="text"
            placeholder="Search all books by title, author, subject, keywords, ISBNs..."
            id={inputId}
            name="q"
            required
          />

          {paragraph.supSearchSubject && (
            <input type="hidden" name="subjects" value={paragraph.supSearchSubject.name} />
          )}
          {!paragraph.supSearchBooksOnly && <input type="hidden" name="only-books" value="false" />}

          <button type="submit" className="group">
            <span className="sr-only">Submit Search</span>
            <MagnifyingGlassIcon
              width={40}
              className="block rounded-full bg-digital-red p-7.5 text-white group-hocus:bg-cardinal-red"
            />
          </button>
        </div>
      </form>
    </div>
  )
}
export default SupSearchFormParagraph
