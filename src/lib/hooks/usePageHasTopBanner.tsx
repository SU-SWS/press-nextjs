"use client"

import {useEffect} from "react"
import {useBoolean} from "usehooks-ts"
import {usePathname} from "next/navigation"

// Use this to determine if the current page has a banner that sits behind the page masthead.
const usePageHasTopBanner = () => {
  const currentPath = usePathname()
  const {value, setTrue, setFalse} = useBoolean(false)

  useEffect(() => {
    if (document.querySelectorAll("[data-top-hero]").length) setTrue()
    return () => setFalse()
  }, [setTrue, setFalse, currentPath])
  return value
}
export default usePageHasTopBanner
