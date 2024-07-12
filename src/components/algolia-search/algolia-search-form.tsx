"use client"

import algoliasearch from "algoliasearch/lite"
import {
  useHits,
  useSearchBox,
  useCurrentRefinements,
  useRefinementList,
  useRange,
  useClearRefinements,
  usePagination,
  useSortBy,
} from "react-instantsearch"
import {InstantSearchNext} from "react-instantsearch-nextjs"
import {H2} from "@components/elements/headers"
import {useEffect, useId, useMemo, useRef, useState} from "react"
import Button from "@components/elements/button"
import {useRouter, useSearchParams} from "next/navigation"
import {Hit as HitType} from "instantsearch.js"
import SelectList from "@components/elements/select-list"
import {SelectOptionDefinition} from "@mui/base/useSelect"
import {RangeBoundaries} from "instantsearch.js/es/connectors/range/connectRange"
import {IndexUiState} from "instantsearch.js/es/types/ui-state"
import {ArrowLongLeftIcon, ArrowLongRightIcon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid"
import DefaultHit, {AlgoliaHit} from "@components/algolia-search/hits/default"
import {CheckIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"

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
        <Form searchIndex={searchIndex} />
      </InstantSearchNext>
    </div>
  )
}

const Form = ({searchIndex}: {searchIndex: string}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const inputRef = useRef<HTMLInputElement>(null)
  const {query, refine} = useSearchBox({})
  const {refine: clearRefinements} = useClearRefinements({})
  const {items: bookSubjectRefinementList, refine: refineBookSubjects} = useRefinementList({
    attribute: "book_subject",
    limit: 100,
  })
  const {items: bookTypeRefinementItems, refine: refineBookType} = useRefinementList({attribute: "book_type"})
  const {
    start: pubYearRange,
    range: pubYearRangeBounds,
    refine: refineRange,
    canRefine: canRefinePubYear,
  } = useRange({attribute: "book_published"})
  const {min: minYear, max: maxYear} = pubYearRangeBounds
  const {items: currentRefinements, canRefine: canRefineCurrent, refine: removeRefinement} = useCurrentRefinements({})

  // State handlers to manage the GET parameters.
  const [rangeChoices, setRangeChoices] = useState<RangeBoundaries>([
    parseInt(searchParams.get("published-min") || "0"),
    parseInt(searchParams.get("published-max") || "3000"),
  ])

  const yearOptions: SelectOptionDefinition<string>[] = []
  for (let i = maxYear || new Date().getFullYear(); i >= (minYear || 1990); i--) {
    yearOptions.push({value: `${i}`, label: `${i}`})
  }

  const id = useId()

  useEffect(() => {
    const rangeFrom = rangeChoices[0] && minYear && rangeChoices[0] > minYear ? rangeChoices[0] : minYear
    const rangeTo = rangeChoices[1] && maxYear && rangeChoices[1] < maxYear ? rangeChoices[1] : maxYear
    refineRange([rangeFrom, rangeTo])
  }, [rangeChoices, minYear, maxYear, refineRange])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
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
    const chosenSubjects = currentRefinements
      .find(refinement => refinement.attribute === "book_subject")
      ?.refinements.map(item => item.value)
    if (chosenSubjects) params.set("subjects", chosenSubjects.join(","))

    router.replace(`?${params.toString()}`, {scroll: false})
  }, [router, searchParams, currentRefinements, query, pubYearRange])

  return (
    <div>
      <form role="search" aria-labelledby="page-title" onSubmit={e => e.preventDefault()}>
        <div className="mx-auto mb-20 flex items-center gap-6 md:w-2/3 md:gap-8">
          <label className="sr-only" htmlFor="search-input">
            Keywords Search
          </label>
          <input
            id="search-input"
            className="rs-pr-1 rs-pl-1 card-paragraph flex-grow border-0 border-b-2 border-black-30 pb-10 pt-8 md:rs-pr-2 md:rs-pl-3 md:py-12"
            ref={inputRef}
            autoComplete="on"
            autoCorrect="on"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={512}
            type="search"
            placeholder="Search"
            defaultValue={query}
            autoFocus
          />

          <button type="submit" onClick={() => refine(inputRef.current?.value || "")} className="group">
            <span className="sr-only">Submit Search</span>
            <MagnifyingGlassIcon
              width={40}
              className="block rounded-full bg-digital-red p-3 text-white group-hocus:bg-cardinal-red"
            />
          </button>
        </div>

        <div className="float-left hidden w-1/4 md:block">
          <div className="rs-mb-2 rs-pb-3 border-b border-black-30">
            <H2 className="type-0 mb-0">Filter by</H2>

            {currentRefinements.filter(refinement => refinement.attribute === "book_subject").length > 0 && (
              <ul className="list-unstyled first:children:rs-mt-0">
                {currentRefinements
                  .filter(refinement => refinement.attribute === "book_subject")
                  .map(refinement => {
                    return refinement.refinements.map((item, i) => (
                      <li
                        key={`refinement-${i}`}
                        className="mb-4 flex w-fit items-center gap-8 border-2 border-press-sand px-10 py-6 text-18"
                      >
                        {item.value}
                        <button
                          aria-labelledby={
                            "subject-" +
                            item.value
                              .toString()
                              .toLowerCase()
                              .replaceAll(/[^a-z0-9]/g, "-")
                          }
                          disabled={!canRefineCurrent}
                          onClick={() => removeRefinement(item)}
                        >
                          <span className="sr-only">Clear</span>
                          <XMarkIcon width={30} />
                        </button>
                      </li>
                    ))
                  })}
              </ul>
            )}
          </div>

          <div className="rs-mb-1 rs-pb-2 border-b border-black-30">
            <label className="flex cursor-pointer items-center justify-between gap-10">
              <span className="text-16">Search only books</span>

              <div className="group relative">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={!!bookTypeRefinementItems.find(item => item.isRefined)}
                  onChange={() => refineBookType("book")}
                />
                <div className="h-6 w-16 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
                <div className="absolute -left-1 -top-2 h-10 w-10 rounded-full border border-fog-dark bg-white shadow outline-8 outline-press-bay/60 transition peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline group-hocus:outline" />
              </div>
            </label>
          </div>

          <fieldset className="rs-mb-1 rs-pb-2 border-b border-black-30">
            <legend className="rs-mb-0 card-paragraph font-medium">Subject</legend>
            {bookSubjectRefinementList.map(refinementOption => (
              <label key={refinementOption.value} className="group mx-5 flex cursor-pointer items-center gap-5 text-16">
                <div className="group relative">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={refinementOption.isRefined}
                    name="subject"
                    onChange={() => refineBookSubjects(refinementOption.value)}
                  />
                  <div className="h-14 w-14 rounded-full peer-focus-visible:bg-press-bay group-hocus:bg-press-bay/60" />
                  <div className="absolute left-3 top-3 h-8 w-8 rounded border-2 border-press-sand-light peer-checked:border-press-grass peer-checked:bg-press-bay-dark peer-focus-visible:border-press-grass group-hocus:border-press-grass" />
                  <CheckIcon width={15} className="absolute left-4 top-4 hidden text-white peer-checked:block" />
                </div>
                <span
                  id={
                    "subject-" +
                    refinementOption.value
                      .toString()
                      .toLowerCase()
                      .replaceAll(/[^a-z0-9]/g, "-")
                  }
                  className="group-hocus:underline"
                >
                  {refinementOption.value}
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend className="rs-mb-1 card-paragraph font-medium">Published Date</legend>

            <div className="flex items-center gap-5">
              <div className="flex-1 flex-grow">
                <div id={`${id}-min-year`} className="mb-2 text-18 text-press-sand-dark">
                  <span className="sr-only">Minimum&nbps;</span>Year
                </div>
                <SelectList
                  options={yearOptions.filter(
                    option =>
                      parseInt(option.value) < (rangeChoices[1] || 3000) && parseInt(option.value) > (minYear || 0)
                  )}
                  value={!rangeChoices[0] || !minYear || rangeChoices[0] <= minYear ? null : `${rangeChoices[0]}`}
                  ariaLabelledby={`${id}-min-year`}
                  disabled={!canRefinePubYear}
                  emptyLabel="Any"
                  onChange={(_e, value) =>
                    setRangeChoices(prevState => [parseInt(value as string) || undefined, prevState[1]])
                  }
                />
              </div>
              <span aria-hidden className="relative top-5">
                to
              </span>
              <div className="flex-1 flex-grow">
                <div id={`${id}-max-year`} className="mb-2 text-18 text-press-sand-dark">
                  <span className="sr-only">Minimum&nbps;</span>Year
                </div>
                <SelectList
                  options={yearOptions.filter(
                    option =>
                      parseInt(option.value) > (rangeChoices[0] || 0) && parseInt(option.value) < (maxYear || 3000)
                  )}
                  value={!rangeChoices[1] || !maxYear || rangeChoices[1] >= maxYear ? null : `${rangeChoices[1]}`}
                  ariaLabelledby={`${id}-max-year`}
                  disabled={!canRefinePubYear}
                  emptyLabel="Any"
                  onChange={(_e, value) =>
                    setRangeChoices(prevState => [prevState[0], parseInt(value as string) || undefined])
                  }
                  className="h-[45px] text-16 *:text-16"
                />
              </div>
            </div>
          </fieldset>

          <Button
            className="my-16"
            centered
            buttonElem
            onClick={() => {
              clearRefinements()
              refine("")
              setRangeChoices([0, 3000])
              if (inputRef.current) inputRef.current.value = ""
            }}
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="md:float-right md:ml-20 md:w-[calc(70%-5rem)]">
        <HitList searchIndex={searchIndex} />
      </div>
    </div>
  )
}

const HitList = ({searchIndex}: {searchIndex: string}) => {
  const {items: hits} = useHits<HitType<AlgoliaHit>>({})
  const {query} = useSearchBox({})

  const {currentRefinement: currentPage, pages, nbPages, nbHits, refine: goToPage} = usePagination({padding: 2})
  const {
    options: sortOptions,
    refine: sortBy,
    currentRefinement: currentSort,
  } = useSortBy({
    items: [
      {label: "Relevance", value: searchIndex},
      {label: "Last Name, A-Z", value: `${searchIndex}_authors_asc`},
      {label: "Last Name, Z-A", value: `${searchIndex}_authors_desc`},
      {label: "Published Year, Asc", value: `${searchIndex}_published_asc`},
      {label: "Published Year, Desc", value: `${searchIndex}_published_desc`},
    ],
  })

  useEffect(() => {
    if (query) sortBy(searchIndex)
  }, [sortBy, searchIndex, query])

  if (hits.length === 0) {
    return <p className="rs-mt-6">No results for your search. Please try another search.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div aria-live="polite" className="card-paragraph">
          {nbHits} {nbHits > 1 ? "Results" : "Result"}
        </div>

        <div className="flex w-1/2 items-center gap-3">
          <div id="sort-by" className="text-16 text-press-sand-dark">
            Sort By:
          </div>
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
        {hits.map(hit => (
          <li key={hit.objectID} className="border-b border-gray-300 last:border-0">
            <DefaultHit hit={hit} />
          </li>
        ))}
      </ul>

      {pages.length > 1 && (
        <nav aria-label="Search results pager">
          <ul className="list-unstyled mx-auto flex w-fit gap-8 *:text-press-sand-dark">
            {pages[0] > 0 && (
              <li>
                <button onClick={() => goToPage(0)}>
                  <span className="sr-only">Go to first page</span>
                  <ArrowLongLeftIcon width={30} />
                </button>
              </li>
            )}

            {pages.map(pageNum => (
              <li
                key={`page-${pageNum}`}
                aria-current={currentPage === pageNum}
                className={clsx("h-fit px-4 pb-3", {"border-b-2 border-press-sand-dark": currentPage === pageNum})}
              >
                <button className="no-underline hocus:underline" onClick={() => goToPage(pageNum)}>
                  {pageNum + 1}
                </button>
              </li>
            ))}

            {pages[pages.length - 1] !== nbPages && (
              <li>
                <button onClick={() => goToPage(nbPages - 1)}>
                  <span className="sr-only">Go to last page</span>
                  <ArrowLongRightIcon width={30} />
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default AlgoliaSearchForm
