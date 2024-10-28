"use client"
import {useCallback, useState, JSX, HTMLAttributes} from "react"
import {useCounter} from "usehooks-ts"
import useServerAction from "@lib/hooks/useServerAction"
import PagedList from "@components/elements/paged-list"
import {twMerge} from "tailwind-merge"
import {clsx} from "clsx"
import {ArrowPathIcon} from "@heroicons/react/16/solid"

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * Server action to load a page.
   */
  loadPage?: (_page: number, _filters?: Record<string, string | number | undefined>) => Promise<JSX.Element>
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
}

const AwardListViewClient = ({totalItems, loadPage, children, ...props}: Props) => {
  const [minYear, setMinYear] = useState<undefined | number>()
  const {count: totalResults, setCount: setTotalResults} = useCounter(totalItems)
  const [items, setItems] = useState<JSX.Element[]>(Array.isArray(children) ? children : [children])

  const onActionFinished = useCallback(
    (response: JSX.Element | undefined) => {
      if (response) {
        setItems(response.props.children)
        setTotalResults(response.props.totalItems)
      }
    },
    [setTotalResults, setItems]
  )

  const [runAction, isPending] = useServerAction<[number, Record<string, string | number | undefined>], JSX.Element>(
    loadPage,
    onActionFinished
  )

  const numItems = items.length

  const onYearChosen = (year_min?: number) => {
    const year_max = !year_min || year_min === 2010 ? undefined : year_min + 10
    runAction(0, {
      year_min,
      year_max,
    })
      .then(() => setMinYear(year_min))
      .catch(_e => console.warn("An error occurred when filtering the awards."))
  }

  let pagerLoadPage
  if (loadPage) {
    pagerLoadPage = (page: number) => {
      const year_max = !minYear || minYear === 2010 ? undefined : minYear + 10
      return loadPage(page, {year_min: minYear, year_max})
    }
  }
  const yearChoices = [2010, 2000, 1990, 1980]

  return (
    <div {...props}>
      {isPending && (
        <div className="absolute left-0 top-0 z-10 h-full w-full rounded-2xl bg-black-20 bg-opacity-30">
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <ArrowPathIcon className="animate-spin" width={50} />
          </div>
        </div>
      )}
      <form>
        <fieldset className="mb-20 flex flex-wrap gap-14 *:min-w-fit">
          <legend className="sr-only">Filter by year</legend>

          <label className="flex cursor-pointer items-center gap-10">
            <div className="group relative">
              <input
                className="peer sr-only"
                type="radio"
                name="years"
                defaultChecked
                onChange={() => onYearChosen()}
              />
              <div className="h-6 w-16 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
              <div className="absolute -top-2 right-7 h-10 w-10 rounded-full border border-fog-dark bg-white shadow outline-8 outline-press-bay/60 transition peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline group-hocus:outline" />
            </div>
            <span>All Winners</span>
          </label>

          {yearChoices.map(year => (
            <label key={"award-winner-year-" + year} className="flex cursor-pointer items-center gap-10">
              <div className="group relative">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="years"
                  value={year}
                  onChange={() => onYearChosen(year)}
                />
                <div className="h-6 w-16 rounded-full bg-press-sand-light shadow-inner peer-checked:bg-press-bay-light" />
                <div className="absolute -top-2 right-7 h-10 w-10 rounded-full border border-fog-dark bg-white shadow outline-8 outline-press-bay/60 transition peer-checked:translate-x-full peer-checked:bg-press-grass peer-focus-visible:outline group-hocus:outline" />
              </div>

              <span>
                {year} - {year === Math.max(...yearChoices) ? "Current" : year + 10}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="sr-only" aria-live="polite" aria-atomic>
          Showing books for {minYear}
        </div>
      </form>
      <PagedList
        key={minYear}
        ulProps={{
          className: twMerge(
            "list-unstyled grid @lg:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4 gap-20",
            clsx({
              "max-w-1200 mx-auto": numItems < 5,
              "@10xl:grid-cols-5": numItems >= 5,
            })
          ),
        }}
        pagerSiblingCount={3}
        pageKey={false}
        totalPages={Math.ceil(totalResults / 30)}
        loadPage={pagerLoadPage}
      >
        {items}
      </PagedList>
    </div>
  )
}
export default AwardListViewClient
