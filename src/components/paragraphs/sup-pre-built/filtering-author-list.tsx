"use client";

import {twMerge} from "tailwind-merge";
import {HTMLAttributes, JSX, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import PagedList from "@components/elements/paged-list";
import {useRouter, useSearchParams} from "next/navigation";
import useFocusOnRender from "@lib/hooks/useFocusOnRender";
import {useBoolean} from "usehooks-ts";

type Props = HTMLAttributes<HTMLDivElement> & {
  authors: Map<string, JSX.Element[]>
}
const FilteringAuthorList = ({authors, ...props}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const focusItemRef = useRef<HTMLDivElement>(null);
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)
  const [alphaChosen, setAlphaChosen] = useState<string>(searchParams.get("author") || "A")

  const displayedAuthors = useMemo(() => {
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

    if (alphaChosen !== "A") {
      params.set("author", alphaChosen)
    } else {
      params.delete("author")
    }
    router.replace(`?${params.toString()}`, {scroll: false})
  }, [router, searchParams, alphaChosen]);

  const setFocusOnItem = useFocusOnRender(focusItemRef, false);

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem]);

  return (
    <div {...props} className={twMerge("flex justify-between", props?.className)}>
      <div className="sr-only" aria-live="polite">Showing authors that start with {alphaChosen}</div>
      <a href="#author-filter" className="skiplink">Skip to filter</a>

      <PagedList itemsPerPage={50} ulProps={{className: "list-unstyled"}} pageKey={false} key={alphaChosen}>
        {[...displayedAuthors.keys()].sort().map((authorName, i) =>
          <div
            key={authorName}
            className="flex flex-wrap gap-2"
            ref={i === 0 ? focusItemRef : null}
            tabIndex={i === 0 && focusOnElement ? 0 : undefined}
            onBlur={disableFocusElement}
          >
            <span>{authorName}</span>
            {authors.get(authorName)}
          </div>
        )}
      </PagedList>
      <nav id="author-filter" aria-label="Author name filtering">
        <ul className="list-unstyled">
          {alphaChoices.map(choice =>
            <li key={choice}>
              <button
                className="hocus:underline"
                onClick={() => {
                  setAlphaChosen(choice)
                  enableFocusElement();
                }}
                aria-label={`Show authors that start with ${choice}`}
                aria-current={alphaChosen === choice}
              >
                {choice}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
export default FilteringAuthorList