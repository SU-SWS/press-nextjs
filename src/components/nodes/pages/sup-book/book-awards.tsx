"use client"

import {JSX, useLayoutEffect, useRef} from "react"
import {useBoolean} from "usehooks-ts"
import useFocusOnRender from "@lib/hooks/useFocusOnRender"
import {ChevronDownIcon} from "@heroicons/react/20/solid"

const BookAwards = ({children}: {children: JSX.Element[]}) => {
  const top = children.slice(0, 3)
  const bottom = children.slice(3)
  const firstBottomRef = useRef<HTMLLIElement>(null)
  const {value: showingMore, setTrue: showMore} = useBoolean(false)
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const setFocusOnItem = useFocusOnRender(firstBottomRef, false)

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem])

  return (
    <div>
      <ul className="list-unstyled mb-10">
        {top.map((item, i) => (
          <li
            className="mb-10"
            key={`top-award-${i}`}
          >
            {item}
          </li>
        ))}
        {showingMore && (
          <>
            {bottom.map((item, i) => (
              <li
                className="mb-10"
                key={`bottom-award-${i}`}
                ref={i === 0 ? firstBottomRef : undefined}
                tabIndex={i === 0 ? 0 : undefined}
                onBlur={disableFocusElement}
              >
                {item}
              </li>
            ))}
          </>
        )}
      </ul>

      {bottom.length > 0 && !showingMore && (
        <button
          className="flex items-center gap-3"
          onClick={() => {
            enableFocusElement()
            showMore()
          }}
        >
          <ChevronDownIcon
            width={24}
            className="shrink-0 text-fog-dark"
          />{" "}
          Read more
        </button>
      )}
    </div>
  )
}
export default BookAwards
