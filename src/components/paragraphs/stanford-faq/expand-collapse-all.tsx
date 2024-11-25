"use client"

import Button from "@components/elements/button"
import {useBoolean} from "usehooks-ts"
import {HTMLAttributes, useEffect, useRef} from "react"

type Props = HTMLAttributes<HTMLButtonElement>

const ExpandCollapseAll = ({...props}: Props) => {
  const {value: expand, toggle} = useBoolean(false)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const buttons = ref.current?.parentElement?.parentElement?.getElementsByTagName("button") || []
    for (let i = 0; i < buttons.length; i++) {
      if (!expand && buttons[i].getAttribute("aria-expanded") === "false") {
        buttons[i].click()
      }

      if (expand && buttons[i].getAttribute("aria-expanded") === "true") {
        buttons[i].click()
      }
    }
  }, [expand])

  return (
    // @ts-expect-error ref object type issue.
    <Button ref={ref} buttonElem onClick={toggle} {...props}>
      {expand ? "Expand All" : "Collapse All"}
    </Button>
  )
}

export default ExpandCollapseAll
