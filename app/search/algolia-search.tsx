"use client";

import algoliasearch from "algoliasearch/lite";
import {useHits, useSearchBox, useCurrentRefinements, useRefinementList, Snippet, useRange, useClearRefinements} from "react-instantsearch";
import {InstantSearchNext} from "react-instantsearch-nextjs";
import Link from "@components/elements/link";
import {H2} from "@components/elements/headers";
import Image from "next/image";
import {useEffect, useId, useRef, useState} from "react";
import Button from "@components/elements/button";
import {UseSearchBoxProps} from "react-instantsearch";
import {useRouter, useSearchParams} from "next/navigation";
import {Hit as HitType} from "instantsearch.js";
import SelectList from "@components/elements/select-list";
import {SelectOptionDefinition} from "@mui/base/useSelect";
import {RangeBoundaries} from "instantsearch.js/es/connectors/range/connectRange";
import {IndexUiState} from "instantsearch.js/es/types/ui-state";
import {useBoolean} from "usehooks-ts";

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
}

const AlgoliaSearch = ({appId, searchIndex, searchApiKey}: Props) => {
  const searchClient = algoliasearch(appId, searchApiKey);
  const searchParams = useSearchParams();

  const initialUiState: IndexUiState = {}
  if (searchParams.get("q")) initialUiState.query = searchParams.get("q") as string
  if (searchParams.get("subjects")) {
    initialUiState.refinementList = {book_subject: searchParams.get("subjects")?.split(",") as string[]}
  }
  if (!!searchParams.get("books")) {
    initialUiState.refinementList = {book_type: ["book"]}
  }
  if (searchParams.get("published-min") || searchParams.get("published-max")) {
    initialUiState.range = {book_published: (searchParams.get("published-min") || "0" as string) + ":" + (searchParams.get("published-max") || "3000" as string)}
  }

  return (
    <div>
      <InstantSearchNext
        indexName={searchIndex}
        searchClient={searchClient}
        initialUiState={{[searchIndex]: initialUiState}}
        future={{preserveSharedStateOnUnmount: true}}
      >
        <div className="space-y-10">
          <SearchBox/>
          <div className="flex gap-24">
            <div className="w-1/4">
              <FacetFilters/>
            </div>
            <div className="flex-grow">
              <HitList/>
            </div>
          </div>
        </div>
      </InstantSearchNext>
    </div>
  )
}

const FacetFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams();

  const {refine: clearRefinements} = useClearRefinements({});
  const {
    items: bookSubjectRefinementList,
    refine: refineBookSubjects,
    canToggleShowMore: canShowMoreRefinements,
    toggleShowMore: showMoreRefinements
  } = useRefinementList({attribute: "book_subject", limit: 100});
  const {refine: refineBookType} = useRefinementList({attribute: "book_type"});
  const {range, canRefine: canRefineRange, refine: refineRange} = useRange({attribute: "book_published"});
  const {min: minYear, max: maxYear} = range;
  const {items: currentRefinements, canRefine: canRefineCurrent, refine: removeRefinement} = useCurrentRefinements({});

  const [rangeChoices, setRangeChoices] = useState<RangeBoundaries>([parseInt(searchParams.get("published-min") || "1000"), parseInt(searchParams.get("published-max") || "3000")]);
  const [subjectChoices, setSubjectChoices] = useState(searchParams.get("subjects")?.split(",") || [])
  const {value: onlyBooks, toggle: toggleOnlyBooks} = useBoolean(!!searchParams.get("books"))

  const yearOptions: SelectOptionDefinition<string>[] = [];
  for (let i = (maxYear || new Date().getFullYear()); i >= (minYear || 1990); i--) {
    yearOptions.push({value: `${i}`, label: `${i}`});
  }

  const id = useId();

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

    router.replace(`?${params.toString()}`, {scroll: false})
  }, [rangeChoices, router, searchParams, maxYear, minYear, refineRange, subjectChoices, onlyBooks]);

  return (
    <div>
      <H2>Filter by</H2>

      <ul className="list-unstyled" aria-live="polite">
        {currentRefinements.filter(refinement => refinement.attribute === "book_subject").map(refinement => {
          return refinement.refinements.map((item, i) =>
            <li key={`refinement-${i}`}>
              {item.value}
              <button aria-labelledby={`${id}-i`} disabled={!canRefineCurrent} onClick={() => removeRefinement(item)}>
                Clear
              </button>
            </li>
          )
        })}

        {canShowMoreRefinements &&
          <Button buttonElem onClick={showMoreRefinements}>Show more options</Button>
        }
      </ul>

      <div>
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

      <fieldset>
        <legend>Subject</legend>
        {bookSubjectRefinementList.map(refinementOption =>
          <label key={refinementOption.value} className="flex items-center gap-5">
            <input
              type="checkbox"
              checked={refinementOption.isRefined}
              onChange={() => {
                refineBookSubjects(refinementOption.value)
                const newSubjectChoices = [...subjectChoices]
                if (newSubjectChoices.includes(refinementOption.value)) {
                  newSubjectChoices.splice(newSubjectChoices.indexOf(refinementOption.value), 1);
                } else {
                  newSubjectChoices.push(refinementOption.value)
                }
                setSubjectChoices(newSubjectChoices);
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
          <span>-</span>
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

      <Button buttonElem onClick={() => {
        clearRefinements()
        setSubjectChoices([]);
        setRangeChoices([minYear, maxYear]);
      }}>Reset</Button>
    </div>
  )
}

const HitList = () => {
  const {hits, results} = useHits<HitType<AlgoliaHit>>({});
  if (hits.length === 0) {
    return (
      <p>No results for your search. Please try another search.</p>
    )
  }

  return (
    <div>
      {results?.nbHits &&
        <div>{results.nbHits} {results.nbHits > 1 ? "Results" : "Result"}</div>
      }
      <ul className="list-unstyled">
        {hits.map(hit =>
          <li key={hit.objectID} className="border-b border-gray-300 last:border-0">
            <Hit hit={hit}/>
          </li>
        )}
      </ul>

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
          <p>{hit.summary}</p>
        }
        {(hit.html && !hit.summary) &&
          <Snippet hit={hit} attribute="html"/>
        }

        <div>
          {hit.book_authors}
        </div>
        <div>
          {hit.book_published}
        </div>
      </div>

      {hit.photo &&
        <div className="hidden @6xl:block relative shrink-0 aspect-1 h-[150px] w-[150px]">
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


const SearchBox = (props?: UseSearchBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {query, refine} = useSearchBox(props);

  return (
    <form
      className="flex flex-col gap-10"
      role="search"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();

        inputRef.current?.blur();
        refine(inputRef.current?.value || "");
      }}
    >
      <div className="flex flex-col">
        <label className="font-bold" htmlFor="search-input">
          Keywords<span className="sr-only">&nbsp;Search</span>
        </label>
        <input
          id="search-input"
          className="rounded-full hocus:shadow-2xl max-w-xl h-20 text-m1"
          ref={inputRef}
          autoComplete="on"
          autoCorrect="on"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={512}
          type="search"
          required
          defaultValue={query}
          autoFocus
        />
      </div>
      <div className="flex gap-10">
        <Button type="submit">
          Search
        </Button>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic>Showing results for {query}</div>
    </form>
  );
}

export default AlgoliaSearch;