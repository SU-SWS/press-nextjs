"use client";

import {twMerge} from "tailwind-merge";
import {HTMLAttributes, JSX, useEffect, useMemo, useState} from "react";
import PagedList from "@components/elements/paged-list";
import {useRouter, useSearchParams} from "next/navigation";

type Props = HTMLAttributes<HTMLDivElement> & {
  authors: Map<string, JSX.Element[]>
}
const FilteringAuthorList = ({authors, ...props}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [alphaChosen, setAlphaChosen] = useState<string>(searchParams.get("author") || "")

  const displayedAuthors = useMemo(() => {
    if(alphaChosen === "") return authors;
    const displayedAuthorMap = new Map<string, JSX.Element[]>();
    [...authors.keys()].map(authorName => {
      let firstLetter = authorName.charAt(0).toUpperCase()
      firstLetter = firstLetter.replace("Ö", "O").replace("Ø", "O");
      if (firstLetter === alphaChosen) displayedAuthorMap.set(authorName, authors.get(authorName) as JSX.Element[]);
    });
    return displayedAuthorMap;
  }, [authors, alphaChosen]);

  const alphaChoices = useMemo(() => {
    let choices: string[] = [];
    [...authors.keys()].map(authorName => {
      choices.push(authorName.charAt(0).toUpperCase().replace("Ö", "O").replace("Ø", "O"));
    })
    choices = [...new Set(choices)].sort((a, b) => a.localeCompare(b));
    return choices;
  }, [authors]);

  useEffect(() => {
    // Use search params to retain any other parameters.
    const params = new URLSearchParams(searchParams.toString());

    if (alphaChosen !== "") {
      params.set("author", alphaChosen)
    } else {
      params.delete("author")
    }
    router.replace(`?${params.toString()}`, {scroll: false})
  }, [router, searchParams, alphaChosen]);

  return (
    <div {...props} className={twMerge("flex justify-between", props?.className)}>
      <div className="sr-only" aria-live="polite">Showing authors that start with {alphaChosen}</div>
      <a href="#author-filter" className="skiplink">Skip to filter</a>

      <PagedList itemsPerPage={50} ulProps={{className: "list-unstyled"}} pageKey={false} key={alphaChosen}>
        {[...displayedAuthors.keys()].sort().map(authorName =>
          <div key={authorName}>
            <span className="pr-4">{authorName}</span>
            {authors.get(authorName)}
          </div>
        )}
      </PagedList>

      <form role="search" id="author-filter" aria-label="Author name filtering">
        <fieldset className="list-unstyled">
          <legend className="sr-only">Filter by first letter</legend>
          <label className="flex">
            <input
              type="radio"
              defaultChecked={alphaChosen === ""}
              name="alpha"
              value={""}
              onChange={() => setAlphaChosen("")}
            />
            All
          </label>

          {alphaChoices.map(choice =>
            <label key={choice} className="flex">
              <input
                type="radio"
                defaultChecked={alphaChosen === choice}
                name="alpha"
                value={choice}
                onChange={() => setAlphaChosen(choice)}
              />
              {choice}
            </label>
          )}
        </fieldset>
      </form>
    </div>
  )
}
export default FilteringAuthorList