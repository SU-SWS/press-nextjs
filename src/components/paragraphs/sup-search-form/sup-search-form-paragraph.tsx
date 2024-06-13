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
      <form
        className="mx-auto max-w-6xl"
        aria-label="Site Search"
        action="/search"
      >
        <div className="mt-10 flex items-center gap-5">
          <label
            htmlFor={inputId}
            className="sr-only"
          >
            Search all books by title, author, subject, keywords, or ISBNs
          </label>

          <input
            className="lg:w-100 h-32 w-full border-0 border-b border-stone text-24 placeholder:-text-m1"
            type="text"
            placeholder="Search all books by title, author, subject, keywords, ISBNs..."
            id={inputId}
            name="q"
            required
          />

          {paragraph.supSearchSubject && (
            <input
              type="hidden"
              name="subjects"
              value={paragraph.supSearchSubject.name}
            />
          )}
          {paragraph.supSearchBooksOnly && (
            <input
              type="hidden"
              name="books"
              value="1"
            />
          )}

          <button
            type="submit"
            className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-digital-red"
          >
            <MagnifyingGlassIcon
              width={25}
              className="text-white"
            />
            <span className="sr-only">Submit Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}
export default SupSearchFormParagraph
