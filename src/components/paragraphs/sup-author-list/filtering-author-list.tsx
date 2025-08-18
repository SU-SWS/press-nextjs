"use client"

import {twMerge} from "tailwind-merge"
import {HTMLAttributes, useCallback, useEffect, useMemo, useState} from "react"
import PagedList from "@components/elements/paged-list"
import {useRouter, useSearchParams} from "next/navigation"
import Link from "@components/elements/link"
import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"

type Props = HTMLAttributes<HTMLDivElement> & {
  authors: Map<string, NodeSupBook[]>
}
const FilteringAuthorList = ({authors, ...props}: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [alphaChosen, setAlphaChosen] = useState<string>(searchParams.get("author") || "")

  const displayedAuthors = useMemo(() => {
    if (alphaChosen === "") return authors
    const displayedAuthorMap = new Map<string, NodeSupBook[]>()
    ;[...authors.keys()].map(authorName => {
      let firstLetter = authorName.charAt(0).toUpperCase()
      firstLetter = firstLetter.replace("Ö", "O").replace("Ø", "O")
      if (firstLetter === alphaChosen) displayedAuthorMap.set(authorName, authors.get(authorName) as NodeSupBook[])
    })
    return displayedAuthorMap
  }, [authors, alphaChosen])

  const alphaChoices = useMemo(() => {
    let choices: string[] = []
    ;[...authors.keys()].map(authorName => {
      choices.push(authorName.charAt(0).toUpperCase().replace("Ö", "O").replace("Ø", "O"))
    })
    choices = [...new Set(choices)].sort((a, b) => a.localeCompare(b))
    return choices
  }, [authors])

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
          {[...displayedAuthors.keys()]
            .sort()
            .slice(page * 25, (page + 1) * 25)
            .map(authorName => (
              <AuthorItem key={authorName} authorName={authorName} books={authors.get(authorName)} />
            ))}
        </>
      )
    },
    [displayedAuthors, authors]
  )

  return (
    <div {...props} className={twMerge("mx-auto flex max-w-[900px] justify-between gap-20", props?.className)}>
      <div className="sr-only" aria-live="polite" aria-atomic>
        Showing authors that start with {alphaChosen}
      </div>
      <a href="#author-filter" className="skiplink">
        Skip to filter
      </a>

      <PagedList
        className="flex-grow"
        totalPages={Math.ceil([...displayedAuthors.keys()].length / 25)}
        ulProps={{className: "list-unstyled mb-36"}}
        pageKey={false}
        key={alphaChosen}
        pagerSiblingCount={2}
        loadPage={loadPage}
      >
        {[...displayedAuthors.keys()]
          .sort()
          .slice(0, 25)
          .map(authorName => (
            <AuthorItem key={authorName} authorName={authorName} books={authors.get(authorName)} />
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

const AuthorItem = ({authorName, books}: {authorName: string; books?: NodeSupBook[]}) => {
  return (
    <div>
      <div className="type-0 pr-4 xl:text-21">{authorName},</div>
      <div className="ml-20">
        {books?.map(book => (
          <Link
            className="block w-fit font-normal text-digital-red"
            key={book.id}
            prefetch={false}
            href={book.path || "#"}
          >
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
