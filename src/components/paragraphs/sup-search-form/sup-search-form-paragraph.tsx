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
      <form aria-label="Site Search" action="/search">
        <div className="relative mt-10">
          <label htmlFor={inputId} className="sr-only">
            Search this site
          </label>

          <input
            className="h-32 w-full lg:w-100 text-24 lg:border-black-20"
            type="text"
            placeholder="Search this site"
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

          <button type="submit" className="absolute top-2 right-5">
            <MagnifyingGlassIcon width={25} className="text-digital-red"/>
            <span className="sr-only">Submit Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}
export default SupSearchFormParagraph;