"use client";

import {useLayoutEffect, useRef, HtmlHTMLAttributes, useEffect, useId} from "react";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useBoolean, useCounter} from "usehooks-ts";
import {useRouter, useSearchParams} from "next/navigation";
import usePagination from "@lib/hooks/usePagination";
import useFocusOnRender from "@lib/hooks/useFocusOnRender";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Attributes for the <ul> container.
   */
  ulProps?: HtmlHTMLAttributes<HTMLUListElement>
  /**
   * Attributes for each <li> element.
   */
  liProps?: HtmlHTMLAttributes<HTMLLIElement>,
  /**
   * The number of items per page.
   */
  itemsPerPage?: number
  /**
   * URL parameter used to save the users page position.
   */
  pageKey?: string | false
  /**
   * Number of sibling pager buttons.
   */
  pagerSiblingCount?: number
}

const PagedList = ({
  children,
  ulProps,
  liProps,
  itemsPerPage = 10,
  pageKey = "page",
  pagerSiblingCount = 2,
  ...props
}: Props) => {
  const id = useId();
  const items = Array.isArray(children) ? children : [children]
  const router = useRouter();
  const searchParams = useSearchParams()

  // Use the GET param for page, but make sure that it is between 1 and the last page. If it's a string or a number
  // outside the range, fix the value, so it works as expected.
  const {
    count: currentPage,
    setCount: setPage
  } = useCounter(Math.max(1, Math.min(Math.ceil(items.length / itemsPerPage), parseInt(searchParams.get(pageKey || "") || "") || 1)))
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const focusItemRef = useRef<HTMLLIElement>(null);
  const [animationParent] = useAutoAnimate<HTMLUListElement>();

  const goToPage = (page: number) => {
    enableFocusElement();
    setPage(page);
  }

  const setFocusOnItem = useFocusOnRender(focusItemRef, false);

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem]);

  useEffect(() => {
    if (!pageKey) return;

    // Use search params to retain any other parameters.
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      params.set(pageKey, `${currentPage}`)
    } else {
      params.delete(pageKey)
    }

    router.replace(`?${params.toString()}`, {scroll: false})
  }, [router, currentPage, pageKey, searchParams]);
  const paginationButtons = usePagination(items.length, currentPage, itemsPerPage, pagerSiblingCount);

  return (
    <div {...props}>
      <ul {...ulProps} ref={animationParent}>
        {items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, i) =>
          <li
            key={`pager-${id}-${i}`}
            ref={i === 0 ? focusItemRef : null}
            tabIndex={i === 0 && focusOnElement ? 0 : undefined}
            onBlur={disableFocusElement}
            {...liProps}
          >
            {item}
          </li>
        )}
      </ul>

      {paginationButtons.length > 1 &&
        <nav aria-label="Pager" className="mx-auto w-fit">
          <ul className="list-unstyled flex gap-5">
            {paginationButtons.map((pageNum, i) => (
              <PaginationButton
                key={`page-button-${pageNum}--${i}`}
                page={pageNum}
                currentPage={currentPage}
                total={Math.ceil(items.length / itemsPerPage)}
                onClick={() => goToPage(pageNum)}
              />
            ))}
          </ul>
        </nav>
      }
    </div>
  )
}

const PaginationButton = ({page, currentPage, total, onClick}: {
  page: number | string
  currentPage: number
  total: number
  onClick: () => void
}) => {
  if (page === 0) {
    return (
      <li className="h-full mt-auto">
        <span className="sr-only">More pages available</span>
        <span aria-hidden>...</span>
      </li>
    )
  }
  const isCurrent = page == currentPage;
  return (
    <li>
      <button
        className="font-medium hocus:underline text-m2"
        onClick={onClick}
        aria-current={isCurrent}
      >
        <span className="sr-only">Go to page {page} of {total}</span>
        <span aria-hidden className={(isCurrent ? "text-stone-dark border-stone-dark" : "text-cardinal-red border-transparent") + " border-b-2 px-4"}>{page}</span>
      </button>
    </li>
  )
}

export default PagedList;