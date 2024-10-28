"use client"

import {liteClient} from "algoliasearch/lite"
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
import {HTMLAttributes, useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from "react"
import Button from "@components/elements/button"
import {useRouter, useSearchParams} from "next/navigation"
import {Hit as HitType} from "instantsearch.js"
import SelectList from "@components/elements/select-list"
import {SelectOptionDefinition} from "@mui/base/useSelect"
import {RangeBoundaries} from "instantsearch.js/es/connectors/range/connectRange"
import {IndexUiState} from "instantsearch.js/es/types/ui-state"
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"
import DefaultHit, {AlgoliaHit} from "@components/algolia-search/hits/default"
import {CheckIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {useBoolean} from "usehooks-ts"
import {twMerge} from "tailwind-merge"

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
  initialUiState?: IndexUiState
}

const AlgoliaSearchForm = ({appId, searchIndex, searchApiKey, initialUiState = {}}: Props) => {
  const searchClient = useMemo(() => liteClient(appId, searchApiKey), [appId, searchApiKey])
  return (
    <div>
      {/* @ts-expect-error React types don't match the library. */}
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
    sortBy: ["count:desc", "name:asc"],
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
    params.delete("only-books")
    params.delete("q")

    // Keyword search.
    if (query) params.set("q", query)

    // Publication year range.
    if (Number.isFinite(pubYearRange[0])) params.set("published-min", `${pubYearRange[0]}`)
    if (Number.isFinite(pubYearRange[1])) params.set("published-max", `${pubYearRange[1]}`)

    // Books only.
    if (!currentRefinements.find(refinement => refinement.attribute === "book_type")) params.set("only-books", "false")

    // Book subjects.
    const chosenSubjects = currentRefinements
      .find(refinement => refinement.attribute === "book_subject")
      ?.refinements.map(item => item.value)
    if (chosenSubjects) params.set("subjects", chosenSubjects.join(","))

    router.replace(`?${params.toString()}${window.location.hash || ""}`, {scroll: false})
  }, [router, searchParams, currentRefinements, query, pubYearRange])

  const {value: expanded, toggle: toggleExpanded} = useBoolean(false)

  return (
    <div>
      <form
        role="search"
        aria-labelledby="page-title"
        onSubmit={e => {
          e.preventDefault()
          document.getElementById("result-summary")?.focus()
        }}
      >
        <div className="mx-auto mb-20 flex items-center justify-center gap-6 md:w-2/3 md:gap-8">
          <label className="sr-only" htmlFor="search-input">
            Keywords Search
          </label>
          <input
            id="search-input"
            className="rs-pr-1 rs-pl-1 card-paragraph max-w-[80%] flex-grow border-0 border-b-2 border-black-30 pb-10 pt-8 md:rs-pr-2 md:rs-pl-3 md:max-w-full md:py-12"
            ref={inputRef}
            autoComplete="on"
            autoCorrect="on"
            spellCheck={false}
            maxLength={512}
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

        <div className="mb-10 border-2 border-press-sand p-4 sm:p-8 md:mb-0 md:border-0 md:p-0">
          <button
            id="advanced-filters-toggle"
            type="button"
            aria-controls="advanced-filters"
            aria-expanded={expanded}
            onClick={toggleExpanded}
            className="type-0 flex w-full items-center justify-between gap-5 font-medium hocus:underline md:hidden xl:text-21"
            aria-label={expanded ? "Close Filters" : "Open Filters"}
          >
            Filter by
            <ChevronDownIcon
              width={20}
              className={twMerge("transition duration-300", clsx({"rotate-180": expanded}))}
            />
          </button>

          <div
            id="advanced-filters"
            className={twMerge("md:float-left md:w-1/4", clsx({"hidden md:block": !expanded}))}
            aria-labelledby="advanced-filters-toggle"
          >
            <div className="rs-mb-2 rs-pb-3 border-b border-black-30">
              <H2 className="type-0 mb-0 hidden md:block xl:text-21">Filter by</H2>

              {currentRefinements.filter(refinement => refinement.attribute === "book_subject").length > 0 && (
                <ul className="list-unstyled first:children:rs-mt-0">
                  {currentRefinements
                    .filter(refinement => refinement.attribute === "book_subject")
                    .map(refinement => {
                      return refinement.refinements.map((item, i) => (
                        <li
                          key={`refinement-${i}`}
                          className="mb-4 flex w-fit items-center gap-8 border-2 border-press-sand px-8 pb-5 pt-4 text-18"
                        >
                          <span id={`refinement-${i}`}>{item.value}</span>
                          <button
                            aria-labelledby={`refinement-${i}`}
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
                <span className="text-18">Search only books</span>

                <div className="group relative">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={!!bookTypeRefinementItems.find(item => item.isRefined)}
                    onChange={() => refineBookType("book")}
                  />
                  <div className="h-6 w-16 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
                  <div className="absolute -left-1 -top-2 h-10 w-10 rounded-full border border-fog-dark bg-white shadow outline-8 outline-press-bay transition peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline group-hocus:outline" />
                </div>
              </label>
            </div>

            <fieldset className="rs-mb-1 rs-pb-2 border-b border-black-30">
              <legend className="rs-mb-0 card-paragraph font-medium">Subject</legend>
              {bookSubjectRefinementList.map(refinementOption => (
                <label
                  key={refinementOption.value}
                  className="group mx-5 flex cursor-pointer items-center gap-5 text-16"
                >
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
                    <span className="sr-only">Maximum&nbps;</span>Year
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
      <div className="border-sand-light rs-pb-1 flex flex-col items-start justify-between border-b sm:flex-row sm:items-center">
        <h2 id="result-summary" tabIndex={-1} aria-live="polite" className="type-0 ml-5 font-medium md:ml-0 xl:text-21">
          {nbHits} {nbHits > 1 ? "Results" : "Result"}
        </h2>

        <div className="flex w-full flex-col items-center gap-3 sm:w-fit sm:flex-row">
          <div id="sort-by" className="ml-10 w-full text-16 text-press-sand-dark sm:ml-0 sm:w-fit">
            Sort By:
          </div>
          <div className="w-full flex-grow sm:w-auto sm:min-w-96">
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
        {hits.map((hit, position) => (
          <HitItem
            key={hit.objectID}
            focusOnItem={position === 0 && currentPage > 0}
            className="border-sand-light border-b last:border-0"
            hit={hit}
          />
        ))}
      </ul>

      {pages.length > 1 && (
        <nav aria-label="Search results pager">
          <ul className="list-unstyled mx-auto flex w-fit items-end gap-8 *:mb-0 *:text-press-sand-dark">
            {pages[0] > 0 && (
              <li>
                <button onClick={() => goToPage(0)} className="group p-4 hocus:rounded-full hocus:bg-cardinal-red">
                  <span className="sr-only">Go to first page</span>
                  <ArrowLongLeftIcon width={30} className="text-stone-dark group-hocus:text-white" />
                </button>
              </li>
            )}

            {pages.map(pageNum => (
              <li
                key={`page-${pageNum}`}
                aria-current={currentPage === pageNum}
                className={twMerge(
                  "h-fit border-b-2 px-4 pb-3",
                  clsx({
                    "border-transparent": currentPage !== pageNum,
                    "border-press-sand-dark": currentPage === pageNum,
                  })
                )}
              >
                <button className="no-underline hocus:underline" onClick={() => goToPage(pageNum)}>
                  {pageNum + 1}
                </button>
              </li>
            ))}

            {pages[pages.length - 1] !== nbPages && (
              <li>
                <button
                  onClick={() => goToPage(nbPages - 1)}
                  className="group p-4 hocus:rounded-full hocus:bg-cardinal-red"
                >
                  <span className="sr-only">Go to last page</span>
                  <ArrowLongRightIcon width={30} className="text-stone-dark group-hocus:text-white" />
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}

const HitItem = ({
  focusOnItem,
  hit,
  ...props
}: HTMLAttributes<HTMLLIElement> & {focusOnItem?: boolean; hit: HitType<AlgoliaHit>}) => {
  const ref = useRef<HTMLLIElement>(null)
  const {value: focus, setFalse: disableFocus} = useBoolean(focusOnItem)

  useLayoutEffect(() => {
    if (focus) {
      const reduceMotion = !!window.matchMedia("(prefers-reduced-motion: reduce)")?.matches
      ref.current?.scrollIntoView({behavior: reduceMotion ? "instant" : "smooth", block: "end", inline: "nearest"})
      ref.current?.focus({preventScroll: true})
    }
  }, [focus])

  return (
    <li {...props} tabIndex={focus ? 0 : undefined} ref={focus ? ref : undefined} onBlur={disableFocus}>
      <DefaultHit hit={hit} />
    </li>
  )
}

export default AlgoliaSearchForm
