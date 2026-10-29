"use client"

import {liteClient, type LiteClient} from "algoliasearch/lite"
import {
  useHits,
  useSearchBox,
  useCurrentRefinements,
  useRefinementList,
  useRange,
  useClearRefinements,
  usePagination,
  useSortBy,
  useInstantSearch,
  InstantSearch,
} from "react-instantsearch"
import {history} from "instantsearch.js/es/lib/routers"
import type {RouterProps} from "instantsearch.js/es/middlewares"
import type {UiState} from "instantsearch.js"
import {H2} from "@components/elements/headers"
import {HTMLAttributes, useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from "react"
import Button from "@components/elements/button"
import {Hit as HitType} from "instantsearch.js"
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
import {useBoolean, useLocalStorage} from "usehooks-ts"
import cn from "@lib/utils/className"
import type {SendEventForHits} from "instantsearch.js/es/lib/utils"
import SelectList, {SelectOption} from "@components/elements/inputs/select-list"

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
}

type RouteState = Record<string, string | undefined>

const SORT_STORAGE_KEY = "search-sort"

/**
 * Defer building the Algolia client until the first search. `liteClient()` shuffles its hosts with `Math.random()`,
 * which blocks prerendering this page. Searches only run in the browser, so the server render never builds it.
 */
const createLazySearchClient = (appId: string, apiKey: string) => {
  let client: LiteClient | undefined
  // InstantSearch registers its user agents during render, before any search runs.
  const agents: [string, string | undefined][] = []

  const getClient = () => {
    if (!client) {
      client = liteClient(appId, apiKey)
      agents.forEach(([segment, version]) => client?.addAlgoliaAgent(segment, version))
    }
    return client
  }

  return {
    // The insights middleware reads these to send click events.
    appId,
    apiKey,
    addAlgoliaAgent: (segment: string, version?: string) => {
      if (client) client.addAlgoliaAgent(segment, version)
      else agents.push([segment, version])
    },
    search: ((...args) => getClient().search(...args)) as LiteClient["search"],
  }
}

/**
 * Search runs entirely in the browser. InstantSearch doesn't query Algolia while the server renders, so the page
 * stays static and bots crawling /search don't spend Algolia operations.
 */
const AlgoliaSearchForm = ({appId, searchIndex, searchApiKey}: Props) => {
  // With Cache Components, Next.js keeps a visited route mounted inside a hidden React <Activity> and reveals it on
  // back/forward or a link back to /search. Hiding the route disposes the InstantSearch instance and its router, and
  // restarting that disposed instance leaves the form unable to search. Mount a fresh instance each time the route is
  // revealed again so it reads the current URL and starts clean. Effects re-run on reveal, but refs persist.
  const [instanceKey, setInstanceKey] = useState(0)
  const hasActivatedRef = useRef(false)
  useLayoutEffect(() => {
    if (hasActivatedRef.current) setInstanceKey(key => key + 1)
    hasActivatedRef.current = true
  }, [])

  return <AlgoliaInstantSearch key={instanceKey} appId={appId} searchIndex={searchIndex} searchApiKey={searchApiKey} />
}

const AlgoliaInstantSearch = ({appId, searchIndex, searchApiKey}: Props) => {
  const searchClient = useMemo(() => createLazySearchClient(appId, searchApiKey), [appId, searchApiKey])

  // The visitor's last sort choice, saved by HitList. `routeToState` reads it on start and on back/forward, so it goes
  // through a ref to keep the routing config stable when the choice changes.
  const [storedSort] = useLocalStorage<string>(SORT_STORAGE_KEY, searchIndex)
  const storedSortRef = useRef(storedSort)
  useEffect(() => {
    storedSortRef.current = storedSort
  }, [storedSort])

  // The routing config has to stay referentially stable. A new object on each render makes InstantSearch rebuild its
  // router.
  const routing = useMemo<RouterProps<UiState, RouteState>>(
    () => ({
      router: history({cleanUrlOnDispose: false}),
      stateMapping: {
        stateToRoute(uiState) {
          const indexUiState = uiState[searchIndex] || {}
          const route: RouteState = {}

          if (indexUiState.range?.book_published_year) {
            const [yearMin, yearMax] = indexUiState.range.book_published_year.split(":")
            if (Number(yearMin) > 0 && Number(yearMin) < 2050) route["published-min"] = yearMin
            if (Number(yearMax) > 0 && Number(yearMax) < 2050) route["published-max"] = yearMax
          }

          if (indexUiState.refinementList?.book_subject?.length)
            route.subjects = indexUiState.refinementList.book_subject.join(",")

          if (!indexUiState.refinementList?.book_type?.includes("book")) route["only-books"] = "false"
          if (indexUiState.query) route.q = indexUiState.query
          if (indexUiState.page && indexUiState.page > 1) route.page = `${indexUiState.page}`
          if (indexUiState.sortBy && indexUiState.sortBy !== searchIndex) route.sort = indexUiState.sortBy
          return route
        },
        routeToState(route) {
          const refinementList: IndexUiState["refinementList"] = {}
          const range: IndexUiState["range"] = {}

          if (route["published-min"] || route["published-max"])
            range.book_published_year = `${route["published-min"] || ""}:${route["published-max"] || ""}`

          if (route["only-books"] !== "false") refinementList.book_type = ["book"]
          if (route.subjects) refinementList.book_subject = route.subjects.split(",")

          // A keyword search defaults to relevance. Browsing without one falls back to the visitor's last sort choice.
          const sortBy = route.sort || (route.q ? undefined : storedSortRef.current)

          return {
            [searchIndex]: {
              query: route.q,
              refinementList,
              range,
              page: route.page ? Number(route.page) : undefined,
              sortBy: sortBy && sortBy.startsWith(searchIndex) ? sortBy : undefined,
            },
          }
        },
      },
    }),
    [searchIndex]
  )

  return (
    <InstantSearch indexName={searchIndex} searchClient={searchClient} insights routing={routing}>
      <Form searchIndex={searchIndex} />
    </InstantSearch>
  )
}

const Form = ({searchIndex}: {searchIndex: string}) => {
  const {items: bookType, refine: refineBookType} = useRefinementList({attribute: "book_type"})

  const inputRef = useRef<HTMLInputElement>(null)
  const {query, refine} = useSearchBox({})
  const {refine: clearRefinements} = useClearRefinements({})
  const {items: bookSubjectRefinementList, refine: refineBookSubjects} = useRefinementList({
    sortBy: ["name:asc", "count:desc"],
    attribute: "book_subject",
    limit: 100,
  })

  const {
    start: pubYearValues,
    range: pubYearRangeBounds,
    refine: refindPubYear,
    canRefine: canRefinePubYear,
  } = useRange({attribute: "book_published_year"})
  const {min: minYear, max: maxYear} = pubYearRangeBounds

  // Read the chosen years straight from the refinement so they follow the URL, the back button and "Reset".
  const pubYears = {
    start: Number.isFinite(pubYearValues[0]) ? Number(pubYearValues[0]) : undefined,
    end: Number.isFinite(pubYearValues[1]) ? Number(pubYearValues[1]) : undefined,
  }

  const {
    items: currentRefinements,
    canRefine: canRefineCurrent,
    refine: removeRefinement,
  } = useCurrentRefinements({includedAttributes: ["book_subject", "book_type"]})

  const yearOptions: SelectOption[] = []

  for (let i = maxYear || new Date().getFullYear(); i >= (minYear || 1990); i--) {
    yearOptions.push({value: `${i}`, label: `${i}`})
  }

  const id = useId()

  const {value: expanded, toggle: toggleExpanded} = useBoolean(false)

  // Keep the uncontrolled input in step when the query changes from outside it, like the back button or "Reset".
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) inputRef.current.value = query
  }, [query])

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
        <div className="mx-auto mb-50 flex items-center justify-center gap-15 md:w-2/3 md:gap-20">
          <label className="sr-only" htmlFor="search-input">
            Keywords Search
          </label>
          <input
            id="search-input"
            className="max-w-[80%] grow border-0 border-b-2 border-black-30 pt-20 rs-pr-1 pb-25 rs-pl-1 card-paragraph md:max-w-full md:py-30 md:rs-pr-2 md:rs-pl-3"
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
              className="block rounded-full bg-digital-red p-7.5 text-white group-hocus:bg-cardinal-red"
            />
          </button>
        </div>

        <div className="mb-25 border-2 border-press-sand p-10 sm:p-20 md:mb-0 md:border-0 md:p-0">
          <button
            id="advanced-filters-toggle"
            type="button"
            aria-controls="advanced-filters"
            aria-expanded={expanded}
            onClick={toggleExpanded}
            className="flex w-full items-center justify-between gap-12.5 type-0 font-medium md:hidden xl:text-21 hocus:underline"
            aria-label={expanded ? "Close Filters" : "Open Filters"}
          >
            Filter by
            <ChevronDownIcon width={20} className={cn("transition duration-300", {"rotate-180": expanded})} />
          </button>

          <div
            id="advanced-filters"
            className={cn("md:float-left md:w-1/4", {"hidden md:block": !expanded})}
            aria-labelledby="advanced-filters-toggle"
          >
            <div className="rs-mb-2 border-b border-black-30 rs-pb-3">
              <H2 className="mb-0 hidden type-0 md:block xl:text-21">Filter by</H2>

              {currentRefinements.filter(refinement => refinement.attribute === "book_subject").length > 0 && (
                <ul className="list-unstyled *:first:rs-mt-0">
                  {currentRefinements
                    .filter(refinement => refinement.attribute === "book_subject")
                    .map(refinement => {
                      return refinement.refinements
                        .sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))
                        .map((item, i) => (
                          <li
                            key={`refinement-${i}`}
                            className="mb-10 flex w-fit items-center gap-20 border-2 border-press-sand px-20 pt-10 pb-12.5 text-18"
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

            <div className="rs-mb-1 border-b border-black-30 rs-pb-2">
              <label className="flex cursor-pointer items-center justify-between gap-25">
                <span className="text-18">Search only books</span>

                <span className="group relative">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={bookType.find(item => item.value === "book")?.isRefined || false}
                    onChange={() => refineBookType("book")}
                  />
                  <span className="block h-15 w-40 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
                  <span className="absolute -top-5 -left-2.5 h-25 w-25 rounded-full border border-fog-dark bg-white shadow-sm outline-8 outline-press-bay transition outline-none group-hocus:outline-solid peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline-solid" />
                </span>
              </label>
            </div>

            <fieldset className="rs-mb-1 border-b border-black-30 rs-pb-2">
              <legend className="rs-mb-0 card-paragraph font-medium">Subject</legend>
              {bookSubjectRefinementList.map(refinementOption => (
                <label
                  key={refinementOption.value}
                  className="group mx-12.5 flex cursor-pointer items-center gap-12.5 text-16"
                >
                  <span className="group relative">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={refinementOption.isRefined}
                      name="subject"
                      onChange={() => refineBookSubjects(refinementOption.value)}
                    />
                    <span className="block h-35 w-35 rounded-full group-hocus:bg-press-bay/60 peer-focus-visible:bg-press-bay peer-focus-visible:group-hocus:bg-press-bay/60" />
                    <span className="absolute top-7.5 left-7.5 h-20 w-20 rounded-[0.3rem] border-2 border-press-sand-light group-hocus:border-press-grass peer-checked:border-press-grass peer-checked:bg-press-bay-dark peer-focus-visible:border-press-grass" />
                    <CheckIcon width={15} className="absolute top-10 left-10 hidden text-white peer-checked:block" />
                  </span>
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

              <div className="flex items-center gap-12.5">
                <div className="flex-1 grow">
                  <div id={`${id}-min-year`} className="mb-5 text-18 text-press-sand-dark">
                    <span className="sr-only">Minimum&nbsp;</span>Year
                  </div>
                  <SelectList<false>
                    items={yearOptions.filter(option => parseInt(option.value) <= (pubYears.end || 3000))}
                    value={!!pubYears.start ? pubYears.start.toString() : null}
                    onValueChange={value => {
                      refindPubYear([value ? Number(value) : undefined, pubYears.end])
                    }}
                    ariaLabelledby={`${id}-min-year`}
                    disabled={!canRefinePubYear}
                    emptyLabel="Any"
                    className="h-[45px] text-16 *:text-16"
                  />
                </div>
                <span aria-hidden className="relative top-12.5">
                  to
                </span>
                <div className="flex-1 grow">
                  <div id={`${id}-max-year`} className="mb-5 text-18 text-press-sand-dark">
                    <span className="sr-only">Maximum&nbsp;</span>Year
                  </div>
                  <SelectList<false>
                    items={yearOptions.filter(option => parseInt(option.value) >= (pubYears.start || 0))}
                    value={!!pubYears.end ? pubYears.end.toString() : null}
                    onValueChange={value => {
                      refindPubYear([pubYears.start, value ? Number(value) : undefined])
                    }}
                    ariaLabelledby={`${id}-max-year`}
                    disabled={!canRefinePubYear}
                    emptyLabel="Any"
                    className="h-[45px] text-16 *:text-16"
                  />
                </div>
              </div>
            </fieldset>

            <Button
              className="my-40"
              centered
              buttonElem
              onClick={() => {
                clearRefinements()
                refine("")
                refindPubYear([-Infinity, Infinity])
                if (inputRef.current) inputRef.current.value = ""
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
      <div className="md:float-right md:ml-50 md:w-[calc(70%-5rem)]">
        <HitList searchIndex={searchIndex} />
      </div>
    </div>
  )
}

const HitList = ({searchIndex}: {searchIndex: string}) => {
  const [, setSortChoice] = useLocalStorage<string>(SORT_STORAGE_KEY, searchIndex)
  const {items: hits, results, sendEvent} = useHits<HitType<AlgoliaHit>>({})
  const {status} = useInstantSearch()
  const {query} = useSearchBox({})

  const {currentRefinement: currentPage, pages, nbPages, nbHits, refine: goToPage} = usePagination({padding: 2})
  const {
    options: sortOptions,
    refine: sortBy,
    currentRefinement: currentSort,
  } = useSortBy({
    items: [
      {label: "Relevance", value: searchIndex},
      {label: "Author, A-Z", value: `${searchIndex}_authors_asc`},
      {label: "Author, Z-A", value: `${searchIndex}_authors_desc`},
      {label: "Publication Year, Desc", value: `${searchIndex}_published_desc`},
    ],
  })

  // A new keyword search switches back to relevance. Skip the first render so a sort that came in on the URL sticks.
  const previousQuery = useRef(query)
  useEffect(() => {
    if (query && query !== previousQuery.current) sortBy(searchIndex)
    previousQuery.current = query
  }, [sortBy, searchIndex, query])

  // Until the first response arrives the results are a placeholder. Don't announce "no results" for a search that
  // hasn't run yet.
  if (results?.__isArtificial || (hits.length === 0 && (status === "loading" || status === "stalled"))) {
    return <p className="rs-mt-6">Loading results&hellip;</p>
  }

  if (hits.length === 0) {
    return (
      <p className="rs-mt-6" aria-live="polite" aria-atomic>
        No results for your search. Please try another search.
      </p>
    )
  }

  return (
    <div>
      <div className="border-sand-light flex flex-col items-start justify-between border-b rs-pb-1 sm:flex-row sm:items-center">
        <h2
          id="result-summary"
          tabIndex={-1}
          aria-live="polite"
          aria-atomic
          className="ml-12.5 type-0 font-medium md:ml-0 xl:text-21"
        >
          {nbHits} {nbHits > 1 ? "Results" : "Result"}
        </h2>

        <div className="flex w-full flex-col items-center gap-7.5 sm:w-fit sm:flex-row">
          <div id="sort-by" className="ml-25 w-full text-16 text-press-sand-dark sm:ml-0 sm:w-fit">
            Sort By:
          </div>
          <div className="w-full grow sm:w-auto sm:min-w-240">
            <SelectList<false>
              ariaLabelledby="sort-by"
              items={sortOptions}
              value={currentSort}
              required
              borderless
              onValueChange={value => {
                if (value) setSortChoice(value)
                if (value) sortBy(value)
              }}
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
            sendEvent={sendEvent}
          />
        ))}
      </ul>

      {pages.length > 1 && (
        <nav aria-label="Search results pager">
          <ul className="list-unstyled mx-auto flex w-fit items-end gap-20 *:mb-0 *:text-press-sand-dark">
            {pages[0] > 0 && (
              <li>
                <button onClick={() => goToPage(0)} className="group p-10 hocus:rounded-full hocus:bg-cardinal-red">
                  <span className="sr-only">Go to first page</span>
                  <ArrowLongLeftIcon width={30} className="text-stone-dark group-hocus:text-white" />
                </button>
              </li>
            )}

            {pages.map(pageNum => (
              <li
                key={`page-${pageNum}`}
                aria-current={currentPage === pageNum ? "page" : undefined}
                className={cn("h-fit border-b-2 px-10 pb-7.5", {
                  "border-transparent": currentPage !== pageNum,
                  "border-press-sand-dark": currentPage === pageNum,
                })}
              >
                <button className="no-underline hocus:underline" onClick={() => goToPage(pageNum)}>
                  {pageNum + 1}
                </button>
              </li>
            ))}

            {pages[pages.length - 1] < nbPages - 1 && (
              <li>
                <button
                  onClick={() => goToPage(nbPages - 1)}
                  className="group p-10 hocus:rounded-full hocus:bg-cardinal-red"
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
  sendEvent,
  ...props
}: HTMLAttributes<HTMLLIElement> & {focusOnItem?: boolean; hit: HitType<AlgoliaHit>; sendEvent: SendEventForHits}) => {
  const ref = useRef<HTMLLIElement>(null)
  const {value: focus, setFalse: disableFocus} = useBoolean(focusOnItem)

  useLayoutEffect(() => {
    if (focus) {
      const reduceMotion = !!window.matchMedia("(prefers-reduced-motion: reduce)")?.matches
      ref.current?.scrollIntoView({
        behavior: reduceMotion ? "instant" : "smooth",
        block: "end",
        inline: "nearest",
      })
      ref.current?.focus({preventScroll: true})
    }
  }, [focus])

  return (
    <li
      {...props}
      tabIndex={focus ? 0 : undefined}
      ref={focus ? ref : undefined}
      onClick={() => sendEvent("click", hit, "Hit Clicked")}
      onAuxClick={() => sendEvent("click", hit, "Hit Clicked")}
      onBlur={disableFocus}
    >
      <DefaultHit hit={hit} />
    </li>
  )
}

export default AlgoliaSearchForm
