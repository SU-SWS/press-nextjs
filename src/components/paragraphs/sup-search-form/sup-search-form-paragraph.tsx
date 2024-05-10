import {HTMLAttributes, useId} from "react";
import {ParagraphSupSearchForm} from "@lib/gql/__generated__/drupal";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";

type Props = HTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupSearchForm
};

const SupSearchFormParagraph = ({paragraph, ...props}: Props) => {
  const inputId = useId();
  return (
    <div {...props}>
      <form className="max-w-6xl mx-auto" aria-label="Site Search" action="/search">
        <div className="flex items-center gap-5 mt-10">
          <label htmlFor={inputId} className="sr-only">
            Search all books by title, author, subject, keywords, or ISBNs
          </label>

          <input
            className="h-32 w-full lg:w-100 text-24 border-0 border-b border-stone placeholder:-text-m1"
            type="text"
            placeholder="Search all books by title, author, subject, keywords, ISBNs..."
            id={inputId}
            name="q"
            required
          />

          {paragraph.supSearchSubject &&
            <input type="hidden" name="subjects" value={paragraph.supSearchSubject.name}/>
          }
          {paragraph.supSearchBooksOnly &&
            <input type="hidden" name="books" value="1"/>
          }

          <button type="submit" className="shrink-0 bg-digital-red rounded-full w-[45px] h-[45px] flex items-center justify-center">
            <MagnifyingGlassIcon width={25} className="text-white"/>
            <span className="sr-only">Submit Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}
export default SupSearchFormParagraph;