"use client"

import {HTMLAttributes, useCallback, useEffect, useMemo, useState} from "react"
import PagedList from "@components/elements/paged-list"
import {useRouter, useSearchParams} from "next/navigation"
import Link from "@components/elements/link"
import cn from "@lib/utils/className"
import {AuthorBook} from "@components/paragraphs/sup-author-list/sup-author-list-paragraph"

type Props = HTMLAttributes<HTMLDivElement> & {
  authors: Map<string, AuthorBook[]>
}

// Group Ö/Ø under O so they land in the correct spot alphabetically instead of sorting after Z.
const normalizeFirstLetter = (authorName: string) =>
  authorName.charAt(0).toUpperCase().replace("Ö", "O").replace("Ø", "O")

const FilteringAuthorList = ({authors, ...props}: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [alphaChosen, setAlphaChosen] = useState<string>(searchParams.get("author") || "")

  const displayedAuthors = useMemo(() => {
    if (alphaChosen === "") return authors
    const displayedAuthorMap = new Map<string, AuthorBook[]>()
    authors.forEach((books, authorName) => {
      if (normalizeFirstLetter(authorName) === alphaChosen) displayedAuthorMap.set(authorName, books)
    })
    return displayedAuthorMap
  }, [authors, alphaChosen])

  const alphaChoices = useMemo(() => {
    const letters = new Set([...authors.keys()].map(normalizeFirstLetter))
    return [...letters].sort((a, b) => a.localeCompare(b))
  }, [authors])

  const sortedAuthorNames = useMemo(
    () => [...displayedAuthors.keys()].sort((a, b) => a.localeCompare(b)),
    [displayedAuthors]
  )

  useEffect(() => {
    // Use search params to retain any other parameters.
    const params = new URLSearchParams(searchParams.toString())
    params.delete("author")
    if (alphaChosen !== "") params.set("author", alphaChosen)

    const newSearch = params.toString()
    if (window.location.search.replace(/^\?/, "") !== newSearch)
      router.replace(`?${newSearch}${window.location.hash || ""}`, {scroll: false})
  }, [router, searchParams, alphaChosen])

  const loadPage = useCallback(
    async (page: number) => {
      return (
        <>
          {sortedAuthorNames.slice(page * 25, (page + 1) * 25).map(authorName => (
            <AuthorItem key={authorName} authorName={authorName} books={displayedAuthors.get(authorName)} />
          ))}
        </>
      )
    },
    [sortedAuthorNames, displayedAuthors]
  )

  return (
    <div {...props} className={cn("mx-auto flex max-w-[900px] justify-between gap-20", props?.className)}>
      <div className="sr-only" aria-live="polite" aria-atomic>
        Showing authors that start with {alphaChosen}
      </div>
      <a href="#author-filter" className="skiplink">
        Skip to filter
      </a>

      <PagedList
        className="flex-grow"
        totalPages={Math.ceil(sortedAuthorNames.length / 25)}
        ulProps={{className: "list-unstyled mb-36"}}
        pageKey={false}
        key={alphaChosen}
        pagerSiblingCount={2}
        loadPage={loadPage}
      >
        {sortedAuthorNames.slice(0, 25).map(authorName => (
          <AuthorItem key={authorName} authorName={authorName} books={displayedAuthors.get(authorName)} />
        ))}
      </PagedList>

      <form role="search" id="author-filter" aria-label="Author name filtering">
        <fieldset className="list-unstyled">
          <legend className="sr-only">Filter by first letter of authors last name</legend>

          <RadioOption value="All" defaultChecked={alphaChosen === ""} onChange={() => setAlphaChosen("")} />

          {alphaChoices.map(choice => (
            <RadioOption
              key={choice}
              value={choice}
              defaultChecked={alphaChosen === choice}
              onChange={() => setAlphaChosen(choice)}
            />
          ))}
        </fieldset>
      </form>
    </div>
  )
}

const AuthorItem = ({authorName, books}: {authorName: string; books?: AuthorBook[]}) => {
  return (
    <div>
      <div className="type-0 pr-4 xl:text-21">{authorName},</div>
      <div className="ml-20">
        {books?.map(book => (
          <Link className="block w-fit font-normal text-digital-red" key={book.uuid} href={book.path || "#"}>
            {book.title}
            {book.supBookSubtitle && `: ${book.supBookSubtitle}`}
          </Link>
        ))}
      </div>
    </div>
  )
}

const RadioOption = ({
  value,
  defaultChecked,
  onChange,
}: {
  value: string
  defaultChecked?: boolean
  onChange: () => void
}) => {
  return (
    <label className="mb-8 block cursor-pointer">
      <input
        className="peer sr-only"
        type="radio"
        defaultChecked={defaultChecked}
        name="alpha"
        value={value}
        onChange={onChange}
      />
      <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-fog-light font-semibold text-press-sand-dark hover:underline peer-checked:bg-digital-red peer-checked:text-white peer-focus:underline peer-focus-visible:outline peer-focus-visible:outline-press-sand-dark">
        {value}
      </span>
    </label>
  )
}

export default FilteringAuthorList
