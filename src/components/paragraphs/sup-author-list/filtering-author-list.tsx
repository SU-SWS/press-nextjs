"use client";

import {twMerge} from "tailwind-merge";
import {HTMLAttributes, JSX, useCallback, useEffect, useId, useMemo, useState} from "react";
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
    if (alphaChosen === "") return authors;
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

  const loadPage =useCallback(async (page: number) => {
    return (
      <>
        {[...displayedAuthors.keys()].sort().slice(page * 25, (page + 1) * 25).map(authorName =>
          <AuthorItem key={authorName} authorName={authorName} books={authors.get(authorName)}/>
        )}
      </>
    )
  }, [displayedAuthors, authors])

  return (
    <div {...props} className={twMerge("flex justify-between", props?.className)}>
      <div className="sr-only" aria-live="polite">Showing authors that start with {alphaChosen}</div>
      <a href="#author-filter" className="skiplink">Skip to filter</a>

      <PagedList
        className="flex-grow"
        totalPages={Math.ceil([...displayedAuthors.keys()].length / 25)}
        ulProps={{className: "list-unstyled mb-36"}}
        pageKey={false}
        key={alphaChosen}
        pagerSiblingCount={1}
        loadPage={loadPage}
      >
        {[...displayedAuthors.keys()].sort().slice(0, 25).map(authorName =>
          <AuthorItem key={authorName} authorName={authorName} books={authors.get(authorName)}/>
        )}
      </PagedList>

      <form role="search" id="author-filter" aria-label="Author name filtering">
        <fieldset className="list-unstyled">
          <legend className="sr-only">Filter by first letter of authors last name</legend>

          <RadioOption
            value="All"
            defaultChecked={alphaChosen === ""}
            onChange={() => setAlphaChosen("")}
          />

          {alphaChoices.map(choice =>
            <RadioOption
              key={choice}
              value={choice}
              defaultChecked={alphaChosen === choice}
              onChange={() => setAlphaChosen(choice)}
            />
          )}
        </fieldset>
      </form>
    </div>
  )
}

const AuthorItem = ({authorName, books}: {authorName: string, books?: JSX.Element[]}) => {
  return (
    <div>
      <div className="pr-4">{authorName},</div>
      <div className="ml-20">{books}</div>
    </div>
  )
}

const RadioOption = ({value, defaultChecked, onChange}: {
  value: string,
  defaultChecked?: boolean,
  onChange: () => void
}) => {
  const id = useId();
  return (
    <div className="mb-8">
      <input
        className="sr-only peer"
        id={`${id}-value`}
        type="radio"
        defaultChecked={defaultChecked}
        name="alpha"
        value={value}
        onChange={onChange}
      />
      <label htmlFor={`${id}-value`} className="flex items-center justify-center h-[45px] w-[45px] bg-fog-light text-press-sand-dark font-semibold rounded-full peer-checked:bg-digital-red peer-checked:text-white cursor-pointer peer-focus-visible:underline hover:underline">
        {value}
      </label>
    </div>
  )
}

export default FilteringAuthorList