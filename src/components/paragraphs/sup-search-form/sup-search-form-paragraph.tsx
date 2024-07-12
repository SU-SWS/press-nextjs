import {HTMLAttributes, useId} from "react"
import {ParagraphSupSearchForm} from "@lib/gql/__generated__/drupal"
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid"

type Props = HTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupSearchForm
}

const SupSearchFormParagraph = ({paragraph, ...props}: Props) => {
  const inputId = useId()
  return (
    <div {...props}>
      <form className="mx-auto max-w-6xl" aria-label="Site Search" action="/search">
        <div className="mt-10 flex items-center gap-5">
          <label htmlFor={inputId} className="sr-only">
            Search all books by title, author, subject, keywords, or ISBNs
          </label>

          <input
            className="lg:w-100 rs-pr-1 rs-pl-1 card-paragraph w-full border-0 border-b-2 border-stone pb-10 pt-8 placeholder:card-paragraph md:rs-pr-2 md:rs-pl-3 md:py-12"
            type="text"
            placeholder="Search all books by title, author, subject, keywords, ISBNs..."
            id={inputId}
            name="q"
            required
          />

          {paragraph.supSearchSubject && (
            <input type="hidden" name="subjects" value={paragraph.supSearchSubject.name} />
          )}
          {paragraph.supSearchBooksOnly && <input type="hidden" name="books" value="1" />}

          <button type="submit" className="group">
            <span className="sr-only">Submit Search</span>
            <MagnifyingGlassIcon
              width={40}
              className="block rounded-full bg-digital-red p-3 text-white group-hocus:bg-cardinal-red"
            />
          </button>
        </div>
      </form>
    </div>
  )
}
export default SupSearchFormParagraph
