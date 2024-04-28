"use client";

import algoliasearch from "algoliasearch/lite";
import {useHits, useSearchBox, useCurrentRefinements, useRefinementList, Snippet, useRange, useClearRefinements, usePagination, useSortBy} from "react-instantsearch";
import {InstantSearchNext} from "react-instantsearch-nextjs";
import Link from "@components/elements/link";
import {H2} from "@components/elements/headers";
import Image from "next/image";
import {useEffect, useId, useRef, useState} from "react";
import Button from "@components/elements/button";
import {useRouter, useSearchParams} from "next/navigation";
import {Hit as HitType} from "instantsearch.js";
import SelectList from "@components/elements/select-list";
import {SelectOptionDefinition} from "@mui/base/useSelect";
import {RangeBoundaries} from "instantsearch.js/es/connectors/range/connectRange";
import {IndexUiState} from "instantsearch.js/es/types/ui-state";
import {useBoolean} from "usehooks-ts";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
  initialUiState?: IndexUiState
}

const AlgoliaSearch = ({appId, searchIndex, searchApiKey, initialUiState = {}}: Props) => {
  const searchClient = algoliasearch(appId, searchApiKey);

  return (
    <div>
      <InstantSearchNext
        indexName={searchIndex}
        searchClient={searchClient}
        initialUiState={{[searchIndex]: initialUiState}}
        future={{preserveSharedStateOnUnmount: true}}
      >
        <SearchForm searchIndex={searchIndex}/>
      </InstantSearchNext>
    </div>
  )
}

const SearchForm = ({searchIndex}: { searchIndex: string }) => {

  const router = useRouter()
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const {refine} = useSearchBox({});
  const {refine: clearRefinements} = useClearRefinements({});
  const {items: bookSubjectRefinementList, refine: refineBookSubjects} = useRefinementList({
    attribute: "book_subject",
    limit: 100
  });
  const {refine: refineBookType} = useRefinementList({attribute: "book_type"});
  const {range, canRefine: canRefineRange, refine: refineRange} = useRange({attribute: "book_published"});
  const {min: minYear, max: maxYear} = range;
  const {items: currentRefinements, canRefine: canRefineCurrent, refine: removeRefinement} = useCurrentRefinements({});

  // State handlers to manage the GET parameters.
  const [queryString, setQueryString] = useState<string>(searchParams.get("q") || "")
  const [rangeChoices, setRangeChoices] = useState<RangeBoundaries>([parseInt(searchParams.get("published-min") || "1000"), parseInt(searchParams.get("published-max") || "3000")]);
  const [subjectChoices, setSubjectChoices] = useState(searchParams.get("subjects")?.split(",") || [])
  const {value: onlyBooks, toggle: toggleOnlyBooks} = useBoolean(!!searchParams.get("books"))

  const yearOptions: SelectOptionDefinition<string>[] = [];
  for (let i = (maxYear || new Date().getFullYear()); i >= (minYear || 1990); i--) {
    yearOptions.push({value: `${i}`, label: `${i}`});
  }

  const id = useId();

  const toggleSubject = (subject:string) => {
    const newSubjectChoices = [...subjectChoices]

    if (newSubjectChoices.includes(subject)) {
      newSubjectChoices.splice(newSubjectChoices.indexOf(subject), 1);
    } else {
      newSubjectChoices.push(subject)
    }
    setSubjectChoices(newSubjectChoices);
  }

  useEffect(() => {
    const rangeFrom = rangeChoices[0] && minYear && rangeChoices[0] > minYear ? rangeChoices[0] : minYear
    const rangeTo = rangeChoices[1] && maxYear && rangeChoices[1] < maxYear ? rangeChoices[1] : maxYear
    refineRange([rangeFrom, rangeTo]);

    const params = new URLSearchParams(searchParams.toString());
    if (rangeFrom && minYear && rangeFrom > minYear) {
      params.set("published-min", `${rangeFrom}`)
    } else {
      params.delete("published-min")
    }

    if (rangeTo && maxYear && rangeTo < maxYear) {
      params.set("published-max", `${rangeTo}`)
    } else {
      params.delete("published-max")
    }

    if (subjectChoices.length > 0) {
      params.set("subjects", subjectChoices.join(","))
    } else {
      params.delete("subjects")
    }

    if (onlyBooks) {
      params.set("books", "1")
    } else {
      params.delete("books")
    }

    if (queryString) {
      params.set("q", queryString)
    } else {
      params.delete("q")
    }

    router.replace(`?${params.toString()}`, {scroll: false})
  }, [rangeChoices, router, searchParams, maxYear, minYear, refineRange, subjectChoices, onlyBooks, queryString]);

  return (
    <div>
      <form role="search" aria-labelledby="page-title" onSubmit={(e) => e.preventDefault()}>
        <div className="lg:w-2/3 mx-auto mb-20 flex gap-5 items-center">
          <label className="sr-only" htmlFor="search-input">
            Keywords Search
          </label>
          <input
            id="search-input"
            className="flex-grow border-0 border-b border-black-30 text-m2"
            ref={inputRef}
            autoComplete="on"
            autoCorrect="on"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={512}
            type="search"
            placeholder="Search"
            required
            defaultValue={queryString}
          />

          <button
            type="submit"
            onClick={() => {
              refine(inputRef.current?.value || "")
              setQueryString(inputRef.current?.value || "")
            }}
          >
            <span className="sr-only">Search</span>
            <MagnifyingGlassIcon width={40} className="bg-cardinal-red text-white rounded-full p-3 block"/>
          </button>
        </div>

        <div className="hidden lg:block float-left w-1/4">
          <div className="border-b border-black-30">
            <H2>Filter by</H2>
            {currentRefinements.filter(refinement => refinement.attribute === "book_subject").length > 0 &&
              <ul className="list-unstyled mb-16" aria-live="polite">
                {currentRefinements.filter(refinement => refinement.attribute === "book_subject").map(refinement => {
                  return refinement.refinements.map((item, i) =>
                    <li
                      key={`refinement-${i}`}
                      className="w-fit flex items-center gap-24 border border-black p-5 mb-5 last:mb-0"
                    >
                      {item.value}
                      <button
                        aria-labelledby={`${id}-i`}
                        disabled={!canRefineCurrent}
                        onClick={() => {
                          removeRefinement(item)
                          toggleSubject(item.value as string)
                        }}
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

          <div className="border-b border-black-30 py-16 mb-16">
            <label className="flex items-center justify-between">
              Search only books
              <input
                type="checkbox"
                checked={onlyBooks}
                onChange={() => {
                  refineBookType("book")
                  toggleOnlyBooks()
                }}
              />
            </label>
          </div>

          <fieldset className="border-b border-black-30 pb-16 mb-16">
            <legend>Subject</legend>
            {bookSubjectRefinementList.map(refinementOption =>
              <label key={refinementOption.value} className="flex items-center gap-5 mb-5 last:mb-0">
                <input
                  type="checkbox"
                  checked={refinementOption.isRefined}
                  onChange={() => {
                    refineBookSubjects(refinementOption.value)
                    toggleSubject(refinementOption.value)
                  }}
                />
                {refinementOption.value}
              </label>
            )}
          </fieldset>

          <fieldset>
            <legend>Published Date</legend>

            <div className="flex gap-5 items-center">
              <div className="flex-grow flex-1">
                <div id={`${id}-min-year`}><span className="sr-only">Minimum&nbps;</span>Year</div>
                <SelectList
                  options={yearOptions.reverse().filter(option => parseInt(option.value) <= (rangeChoices[1] || new Date().getFullYear()))}
                  value={(!rangeChoices[0] || !minYear || rangeChoices[0] < minYear) ? undefined : `${rangeChoices[0]}`}
                  ariaLabelledby={`${id}-min-year`}
                  disabled={!canRefineRange}
                  onChange={(_e, value) => setRangeChoices((prevState) => [parseInt(value as string) || undefined, prevState[1]])}
                />
              </div>
              <span aria-hidden>to</span>
              <div className="flex-grow flex-1">
                <div id={`${id}-max-year`}><span className="sr-only">Minimum&nbps;</span>Year</div>
                <SelectList
                  options={yearOptions.filter(option => parseInt(option.value) >= (rangeChoices[0] || 1900))}
                  value={(!rangeChoices[1] || !maxYear || rangeChoices[1] > maxYear) ? undefined : `${rangeChoices[1]}`}
                  ariaLabelledby={`${id}-max-year`}
                  disabled={!canRefineRange}
                  onChange={(_e, value) => setRangeChoices((prevState) => [prevState[0], parseInt(value as string) || undefined])}
                />
              </div>
            </div>
          </fieldset>

          <Button className="my-16" centered buttonElem onClick={() => {
            clearRefinements()
            refine("")
            setSubjectChoices([]);
            setRangeChoices([minYear, maxYear]);
            if (inputRef.current) inputRef.current.value = ""
            setQueryString("")
          }}>Reset</Button>
        </div>
      </form>

      <div className="lg:float-right lg:ml-20 lg:w-[calc(75%-5rem)]">
        <HitList searchIndex={searchIndex}/>
      </div>
    </div>
  )
}

const HitList = ({searchIndex}: { searchIndex: string }) => {
  const {hits} = useHits<HitType<AlgoliaHit>>({});
  const {pages, nbPages, nbHits, refine: goToPage} = usePagination({padding: 2})
  const {options: sortOptions, refine: sortBy, currentRefinement: currentSort} = useSortBy({
    items: [
      {label: "Relevance", value: searchIndex},
      {label: "Authors A-Z", value: `${searchIndex}_authors_asc`},
      {label: "Authors Z-A", value: `${searchIndex}_authors_desc`},
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
        {nbHits &&
          <div>{nbHits} {nbHits > 1 ? "Results" : "Result"}</div>
        }

        <div className="flex items-center gap-3 w-1/2">
          <div id="sort-by">Sort By</div>
          <div className="flex-grow">
            <SelectList
              ariaLabelledby="sort-by"
              options={sortOptions}
              value={currentSort}
              required
              onChange={(_e, value) => sortBy(value as string)}
            />
          </div>
        </div>
      </div>

      <ul className="list-unstyled">
        {hits.map(hit =>
          <li key={hit.objectID} className="border-b border-gray-300 last:border-0">
            <Hit hit={hit}/>
          </li>
        )}
      </ul>

      {pages.length > 1 &&
        <nav className="flex justify-between" aria-label="Search results pages">
          {pages[0] > 0 &&
            <button onClick={() => goToPage(0)}>
              First
            </button>
          }

          {pages.map(pageNum =>
            <button key={`page-${pageNum}`} onClick={() => goToPage(pageNum)}>
              {pageNum + 1}
            </button>
          )}

          {pages[pages.length - 1] !== nbPages &&
            <button onClick={() => goToPage(nbPages - 1)}>
              Last
            </button>
          }
        </nav>
      }
    </div>
  )
}

type AlgoliaHit = {
  url: string
  title: string
  summary?: string
  photo?: string
  updated?: number
  html?: string
  book_published?: number
  book_authors?: string
}

const Hit = ({hit}: { hit: HitType<AlgoliaHit> }) => {
  const hitUrl = new URL(hit.url);

  return (
    <article className="@container flex justify-between gap-20 py-12">
      <div>
        <H2 className="text-m2">
          <Link href={hit.url.replace(hitUrl.origin, "")}>
            {hit.title}
          </Link>
        </H2>

        {hit.summary &&
          <p className="mb-10">{hit.summary}</p>
        }
        {(hit.html && !hit.summary) &&
          <p className="mb-10">
            <Snippet hit={hit} attribute="html"/>
          </p>
        }

        {hit.book_authors &&
          <div>
            {hit.book_authors}
          </div>
        }
        {hit.book_published &&
          <div>
            {hit.book_published}
          </div>
        }
      </div>

      {hit.photo &&
        <div className="relative shrink-0 aspect-[2/3] w-[150px]">
          <Image
            className="object-cover"
            src={hit.photo}
            alt=""
            fill
            sizes="300px"
          />
        </div>
      }
    </article>
  )
}


export default AlgoliaSearch;