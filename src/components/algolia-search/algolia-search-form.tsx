"use client";

import algoliasearch from "algoliasearch/lite";
import {useHits, useSearchBox, useCurrentRefinements, useRefinementList, useRange, useClearRefinements, usePagination, useSortBy} from "react-instantsearch";
import {InstantSearchNext} from "react-instantsearch-nextjs";
import {H2} from "@components/elements/headers";
import {useEffect, useId, useMemo, useRef, useState} from "react";
import Button from "@components/elements/button";
import {useRouter, useSearchParams} from "next/navigation";
import {Hit as HitType} from "instantsearch.js";
import SelectList from "@components/elements/select-list";
import {SelectOptionDefinition} from "@mui/base/useSelect";
import {RangeBoundaries} from "instantsearch.js/es/connectors/range/connectRange";
import {IndexUiState} from "instantsearch.js/es/types/ui-state";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";
import DefaultHit, {AlgoliaHit} from "@components/algolia-search/hits/default";
import {CheckIcon} from "@heroicons/react/20/solid";

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
  initialUiState?: IndexUiState
}

const AlgoliaSearchForm = ({appId, searchIndex, searchApiKey, initialUiState = {}}: Props) => {
  const searchClient = useMemo(() => algoliasearch(appId, searchApiKey), [appId, searchApiKey])
  return (
    <div>
      <InstantSearchNext
        indexName={searchIndex}
        searchClient={searchClient}
        initialUiState={{[searchIndex]: initialUiState}}
        future={{preserveSharedStateOnUnmount: true}}
      >
        <Form searchIndex={searchIndex}/>
      </InstantSearchNext>
    </div>
  )
}

const Form = ({searchIndex}: { searchIndex: string }) => {

  const router = useRouter()
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const {query, refine} = useSearchBox({});
  const {refine: clearRefinements} = useClearRefinements({});
  const {items: bookSubjectRefinementList, refine: refineBookSubjects} = useRefinementList({
    attribute: "book_subject",
    limit: 100
  });
  const {items: bookTypeRefinmenItems, refine: refineBookType} = useRefinementList({attribute: "book_type"});
  const {
    start: pubYearRange,
    range: pubYearRangeBounds,
    refine: refineRange,
    canRefine: canRefinePubYear
  } = useRange({attribute: "book_published"});
  const {min: minYear, max: maxYear} = pubYearRangeBounds;
  const {items: currentRefinements, canRefine: canRefineCurrent, refine: removeRefinement} = useCurrentRefinements({});

  // State handlers to manage the GET parameters.
  const [rangeChoices, setRangeChoices] = useState<RangeBoundaries>([parseInt(searchParams.get("published-min") || "0"), parseInt(searchParams.get("published-max") || "3000")]);

  const yearOptions: SelectOptionDefinition<string>[] = [];
  for (let i = (maxYear || new Date().getFullYear()); i >= (minYear || 1990); i--) {
    yearOptions.push({value: `${i}`, label: `${i}`});
  }

  const id = useId();

  useEffect(() => {
    const rangeFrom = rangeChoices[0] && minYear && rangeChoices[0] > minYear ? rangeChoices[0] : minYear
    const rangeTo = rangeChoices[1] && maxYear && rangeChoices[1] < maxYear ? rangeChoices[1] : maxYear
    refineRange([rangeFrom, rangeTo]);
  }, [rangeChoices, minYear, maxYear, refineRange]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("published-min")
    params.delete("published-max")
    params.delete("subjects")
    params.delete("books")
    params.delete("q")

    // Keyword search.
    if (query) params.set("q", query)

    // Publication year range.
    if (Number.isFinite(pubYearRange[0])) params.set("published-min", `${pubYearRange[0]}`)
    if (Number.isFinite(pubYearRange[1])) params.set("published-max", `${pubYearRange[1]}`)

    // Books only.
    if (!!currentRefinements.find(refinement => refinement.attribute === "book_type")) params.set("books", "1")

    // Book subjects.
    const chosenSubjects = currentRefinements.find(refinement => refinement.attribute === "book_subject")?.refinements.map(item => item.value);
    if (chosenSubjects) params.set("subjects", chosenSubjects.join(","));

    router.replace(`?${params.toString()}`, {scroll: false})
  }, [router, searchParams, currentRefinements, query, pubYearRange]);

  return (
    <div>
      <form role="search" aria-labelledby="page-title" onSubmit={(e) => e.preventDefault()}>
        <div className="md:w-2/3 mx-auto mb-20 flex gap-5 items-center">
          <label className="sr-only" htmlFor="search-input">
            Keywords Search
          </label>
          <input
            id="search-input"
            className="flex-grow border-0 border-b border-black-30 text-m2 placeholder:-text-m1"
            ref={inputRef}
            autoComplete="on"
            autoCorrect="on"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={512}
            type="search"
            placeholder="Search"
            defaultValue={query}
          />

          <button
            type="submit"
            onClick={() => refine(inputRef.current?.value || "")}
          >
            <span className="sr-only">Submit Search</span>
            <MagnifyingGlassIcon width={40} className="bg-cardinal-red text-white rounded-full p-3 block"/>
          </button>
        </div>

        <div className="hidden md:block float-left w-1/4">
          <div className="border-b border-black-30 pb-20 mb-16">
            <H2 className="text-m1">
              Filter by
            </H2>

            {currentRefinements.filter(refinement => refinement.attribute === "book_subject").length > 0 &&
              <ul className="list-unstyled mb-16">
                {currentRefinements.filter(refinement => refinement.attribute === "book_subject").map(refinement => {
                  return refinement.refinements.map((item, i) =>
                    <li
                      key={`refinement-${i}`}
                      className="w-fit flex items-center gap-8 border-2 border-press-sand p-5"
                    >
                      {item.value}
                      <button
                        aria-labelledby={`${id}-i`}
                        disabled={!canRefineCurrent}
                        onClick={() => removeRefinement(item)}
                      >
                        <span className="sr-only">Clear</span>
                        <XMarkIcon width={30}/>
                      </button>
                    </li>
                  )
                })}
              </ul>
            }
          </div>

          <div className="border-b border-black-30 pb-16 mb-14">
            <label className="flex items-center justify-between gap-10">
              <span>Search only books</span>

              <div className="relative">
                <input
                  className="sr-only peer"
                  type="checkbox"
                  checked={!!bookTypeRefinmenItems.find(item => item.isRefined)}
                  onChange={() => refineBookType("book")}
                />
                <div
                  className="w-16 h-6 bg-press-sand-light peer-checked:bg-press-bay-light rounded-full shadow-inner"/>
                <div
                  className="absolute w-10 h-10 bg-white peer-checked:bg-press-grass rounded-full shadow border border-fog-dark -left-1 -top-2 transition peer-checked:translate-x-full peer-focus-visible:outline outline-press-grass-light"
                />
              </div>
            </label>
          </div>

          <fieldset className="border-b border-black-30 pb-16 mb-12">
            <legend className="font-medium text-m1 mb-6">Subject</legend>
            {bookSubjectRefinementList.map(refinementOption =>
              <label key={refinementOption.value} className="flex items-center gap-5 mt-5 mb-8">
                <div className="relative">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={refinementOption.isRefined}
                    name="subject"
                    onChange={() => refineBookSubjects(refinementOption.value)}
                  />
                  <div className="peer-focus-visible:bg-press-bay w-14 h-14 rounded-full"/>
                  <div className="absolute left-3 top-3 w-8 h-8 border-2 border-press-sand-light rounded peer-focus-visible:border-press-grass peer-checked:bg-press-grass-light peer-checked:border-press-bay-dark"/>
                  <CheckIcon width={15} className="text-white absolute left-4 top-4 hidden peer-checked:block"/>
                </div>
                <span>{refinementOption.value}</span>
              </label>
            )}
          </fieldset>

          <fieldset>
            <legend className="font-medium text-m1 mb-6">Published Date</legend>

            <div className="flex gap-5 items-center">
              <div className="flex-grow flex-1">
                <div id={`${id}-min-year`} className="text-stone">
                  <span className="sr-only">Minimum&nbps;</span>Year
                </div>
                <SelectList
                  options={yearOptions.filter(option => parseInt(option.value) < (rangeChoices[1] || 3000) && parseInt(option.value) > (minYear || 0))}
                  value={(!rangeChoices[0] || !minYear || rangeChoices[0] <= minYear) ? null : `${rangeChoices[0]}`}
                  ariaLabelledby={`${id}-min-year`}
                  disabled={!canRefinePubYear}
                  emptyLabel="Any"
                  onChange={(_e, value) => setRangeChoices((prevState) => [parseInt(value as string) || undefined, prevState[1]])}
                />
              </div>
              <span aria-hidden className="relative top-5">to</span>
              <div className="flex-grow flex-1">
                <div id={`${id}-max-year`} className="text-stone">
                  <span className="sr-only">Minimum&nbps;</span>Year
                </div>
                <SelectList
                  options={yearOptions.filter(option => parseInt(option.value) > (rangeChoices[0] || 0) && parseInt(option.value) < (maxYear || 3000))}
                  value={(!rangeChoices[1] || !maxYear || rangeChoices[1] >= maxYear) ? null : `${rangeChoices[1]}`}
                  ariaLabelledby={`${id}-max-year`}
                  disabled={!canRefinePubYear}
                  emptyLabel="Any"
                  onChange={(_e, value) => setRangeChoices((prevState) => [prevState[0], parseInt(value as string) || undefined])}
                />
              </div>
            </div>
          </fieldset>

          <Button className="my-16" centered buttonElem onClick={() => {
            clearRefinements()
            refine("")
            setRangeChoices([0, 3000]);
            if (inputRef.current) inputRef.current.value = ""
          }}>Reset</Button>
        </div>
      </form>

      <div className="md:float-right md:ml-20 md:w-[calc(70%-5rem)]">
        <HitList searchIndex={searchIndex}/>
      </div>
    </div>
  )
}

const HitList = ({searchIndex}: { searchIndex: string }) => {
  const {hits} = useHits<HitType<AlgoliaHit>>({});
  const {currentRefinement: currentPage, pages, nbPages, nbHits, refine: goToPage} = usePagination({padding: 2})
  const {options: sortOptions, refine: sortBy, currentRefinement: currentSort} = useSortBy({
    items: [
      {label: "Relevance", value: searchIndex},
      {label: "Last Name, A-Z", value: `${searchIndex}_authors_asc`},
      {label: "Last Name, Z-A", value: `${searchIndex}_authors_desc`},
    ]
  })
  if (hits.length === 0) {
    return (
      <p>No results for your search. Please try another search.</p>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div aria-live="polite">{nbHits} {nbHits > 1 ? "Results" : "Result"}</div>

        <div className="flex items-center gap-3 w-1/2">
          <div id="sort-by" className="text-stone">Sort By:</div>
          <div className="flex-grow">
            <SelectList
              ariaLabelledby="sort-by"
              options={sortOptions}
              value={currentSort}
              required
              borderless
              onChange={(_e, value) => sortBy(value as string)}
            />
          </div>
        </div>
      </div>

      <ul className="list-unstyled">
        {hits.map(hit =>
          <li key={hit.objectID} className="border-b border-gray-300 last:border-0">
            <DefaultHit hit={hit}/>
          </li>
        )}
      </ul>

      {pages.length > 1 &&
        <nav aria-label="Search results pager">
          <ul className="list-unstyled flex justify-between">
            {pages[0] > 0 &&
              <li>
                <button onClick={() => goToPage(0)}>
                  First
                </button>
              </li>
            }

            {pages.map(pageNum =>
              <li key={`page-${pageNum}`} aria-current={currentPage === pageNum}>
                <button onClick={() => goToPage(pageNum)}>
                  {pageNum + 1}
                </button>
              </li>
            )}

            {pages[pages.length - 1] !== nbPages &&
              <li>
                <button onClick={() => goToPage(nbPages - 1)}>
                  Last
                </button>
              </li>
            }
          </ul>
        </nav>
      }
    </div>
  )
}

export default AlgoliaSearchForm;
