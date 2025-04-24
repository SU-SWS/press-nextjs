"use client"

import {useLayoutEffect, useRef, HtmlHTMLAttributes, useEffect, JSX, useState, useCallback} from "react"
import {useBoolean, useCounter} from "usehooks-ts"
import {useRouter, useSearchParams} from "next/navigation"
import usePagination from "@lib/hooks/usePagination"
import useFocusOnRender from "@lib/hooks/useFocusOnRender"
import {ArrowLongLeftIcon, ArrowLongRightIcon} from "@heroicons/react/20/solid"
import {ArrowPathIcon} from "@heroicons/react/16/solid"
import {twMerge} from "tailwind-merge"
import useServerAction from "@lib/hooks/useServerAction"
import clsx from "clsx"
import {InputMaybe, SupBooksAwardWinnersFilterInput, SupBooksViewSortKeys} from "@lib/gql/__generated__/drupal.d"
import SelectList from "@components/elements/select-list"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Attributes for the <ul> container.
   */
  ulProps?: HtmlHTMLAttributes<HTMLUListElement>
  /**
   * Attributes for each <li> element.
   */
  liProps?: HtmlHTMLAttributes<HTMLLIElement>
  /**
   * URL parameter used to save the users page position.
   */
  pageKey?: string | false
  /**
   * Number of sibling pager buttons.
   */
  pagerSiblingCount?: number
  /**
   * Total number of pages to build the pager.
   */
  totalPages: number
  /**
   * Server action to load a page.
   */
  loadPage?: (
    _page: number,
    _filters?: InputMaybe<SupBooksAwardWinnersFilterInput>,
    _sort?: InputMaybe<SupBooksViewSortKeys>
  ) => Promise<JSX.Element>
  sortable?: boolean
}

const PagedList = ({
  children,
  ulProps,
  liProps,
  pageKey = "page",
  totalPages,
  pagerSiblingCount = 2,
  loadPage,
  sortable,
  ...props
}: Props) => {
  const ref = useRef(false)
  const [items, setItems] = useState<JSX.Element[]>(Array.isArray(children) ? children : [children])
  const [sortKey, setSortKey] = useState<SupBooksViewSortKeys>(SupBooksViewSortKeys["PubDateDesc"])
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use the GET param for page, but make sure that it is between 1 and the last page. If it's a string or a number
  // outside the range, fix the value, so it works as expected.
  const {count: currentPage, setCount: setPage} = useCounter(parseInt(pageKey ? searchParams.get(pageKey) || "1" : "1"))
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const afterAction = useCallback(() => {
    if (!pageKey) return

    // Use search params to retain any other parameters.
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(pageKey) === currentPage.toString() || (params.get(pageKey) === null && currentPage === 1)) return

    params.delete(pageKey)
    if (currentPage > 1) params.set(pageKey, `${currentPage}`)

    router.replace(`?${params.toString()}${window.location.hash || ""}`, {scroll: false})
  }, [currentPage, pageKey, router, searchParams])

  const [runAction, isRunning] = useServerAction<
    [number, InputMaybe<SupBooksAwardWinnersFilterInput> | undefined, InputMaybe<SupBooksViewSortKeys> | undefined],
    JSX.Element
  >(loadPage, afterAction)

  const focusItemRef = useRef<HTMLLIElement>(null)

  const goToPage = useCallback(
    (
      page: number,
      doNotFocusOnResults?: boolean,
      _filters?: InputMaybe<SupBooksAwardWinnersFilterInput>,
      sort?: InputMaybe<SupBooksViewSortKeys>
    ) => {
      runAction(page - 1, undefined, sort || sortKey)
        .then(response => {
          if (response) {
            // Set the rendering to the response from the server. If the response has a suspense boundary, it will have a
            // fallback prop. Then we only want to render the list of children within the suspense.
            setItems(response.props.fallback ? response.props.children.props.children : response.props.children)

            // When loading a page during the initial page load, we don't want to focus on anything. But when a user changes
            // pages, we want to focus on the first element.
            if (!doNotFocusOnResults) enableFocusElement()
            setPage(page)
          }
        })
        .catch(() => console.warn("An error occurred fetching more results."))
    },
    [enableFocusElement, setPage, runAction]
  )

  const setFocusOnItem = useFocusOnRender(focusItemRef, false)

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem])

  useEffect(() => {
    const initialPage = Math.min(totalPages, Math.max(1, parseInt((pageKey && searchParams.get(pageKey)) || "1")))
    if (initialPage > 1 && !ref.current) goToPage(initialPage, true)
    ref.current = true
  }, [totalPages, searchParams, pageKey, currentPage, goToPage])

  const paginationButtons = usePagination(totalPages * items.length, currentPage, items.length, pagerSiblingCount)

  const sortOptions = [
    {label: "Title, A-Z", value: SupBooksViewSortKeys["TitleAsc"]},
    {label: "Author, A-Z", value: SupBooksViewSortKeys["AuthorAsc"]},
    {label: "Author, Z-A", value: SupBooksViewSortKeys["AuthorDesc"]},
    {label: "Publication Year, Desc", value: SupBooksViewSortKeys["PubDateDesc"]},
  ]

  return (
    <div {...props} className={twMerge("relative", props.className)}>
      {sortable && (
        <div className="mb-16 ml-auto flex w-fit items-center gap-3">
          <div id="sort-by" className="text-16 text-press-sand-dark">
            Sort By:
          </div>
          <div className="min-w-96">
            <SelectList
              ariaLabelledby="sort-by"
              options={sortOptions}
              required
              defaultValue={SupBooksViewSortKeys["PubDateDesc"]}
              borderless
              onChange={(_e, value) => {
                setSortKey(value as SupBooksViewSortKeys)
                goToPage(0, undefined, undefined, value as SupBooksViewSortKeys)
              }}
            />
          </div>
        </div>
      )}

      {isRunning && (
        <div className="absolute left-0 top-0 z-10 h-full w-full rounded-2xl bg-black-20 bg-opacity-30">
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <ArrowPathIcon className="animate-spin" width={50} />
          </div>
        </div>
      )}
      <ul {...ulProps}>
        {items.map((item, i) => (
          <li
            key={`pager-${currentPage}-${i}`}
            ref={i === 0 ? focusItemRef : null}
            tabIndex={i === 0 && focusOnElement ? 0 : undefined}
            onBlur={disableFocusElement}
            {...liProps}
          >
            {item}
          </li>
        ))}
      </ul>

      {loadPage && paginationButtons.length > 1 && (
        <nav aria-label="Pager" className="rs-mt-4 mx-auto w-fit">
          <ul className="list-unstyled flex items-center gap-5">
            {paginationButtons.map((pageNum, i) => (
              <PaginationButton
                key={`page-button-${pageNum}--${i}`}
                page={pageNum}
                currentPage={currentPage}
                total={totalPages}
                onPageClick={goToPage}
                pagerSiblingCount={pagerSiblingCount}
                disabled={isRunning}
              />
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

const PaginationButton = ({
  page,
  currentPage,
  total,
  onPageClick,
  disabled,
}: {
  page: number | string
  currentPage: number
  total: number
  onPageClick: (_page: number) => void
  pagerSiblingCount: number
  disabled: boolean
}) => {
  if (page === 0) {
    return (
      <li className="mt-auto h-full">
        <span className="sr-only">More pages available</span>
        <span aria-hidden>...</span>
      </li>
    )
  }

  const handleClick = () => {
    if (page === "leftArrow") return onPageClick(1)
    if (page === "rightArrow") return onPageClick(total)
    onPageClick(page as number)
  }

  const isCurrent = page === currentPage
  return (
    <li className="m-0 flex items-center">
      <button
        className={twMerge(
          "group type-1 font-medium hocus:text-stone-dark hocus:underline xl:text-26",
          clsx({
            "p-4 hocus:rounded-full hocus:bg-cardinal-red": page === "leftArrow" || page === "rightArrow",
          })
        )}
        onClick={handleClick}
        aria-current={isCurrent ? "page" : undefined}
        disabled={disabled}
      >
        <span className="sr-only">
          {page === "leftArrow" && "Go to first page"}
          {page === "rightArrow" && "Go to last page"}
          {page !== "leftArrow" && page !== "rightArrow" && `Go to page ${page}`}
        </span>
        <span
          aria-hidden
          className={
            (isCurrent ? "border-stone-dark text-stone-dark" : "border-transparent text-cardinal-red") +
            " block h-fit border-b-2 px-4"
          }
        >
          {page === "leftArrow" && <ArrowLongLeftIcon width={30} className="text-stone-dark group-hocus:text-white" />}
          {page === "rightArrow" && (
            <ArrowLongRightIcon width={30} className="text-stone-dark group-hocus:text-white" />
          )}
          {page !== "leftArrow" && page !== "rightArrow" && page}
        </span>
      </button>
    </li>
  )
}

export default PagedList
