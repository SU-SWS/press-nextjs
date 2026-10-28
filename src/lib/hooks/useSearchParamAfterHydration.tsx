"use client"

import {useSyncExternalStore} from "react"

// The value is only read when the component renders. Changes made with `history.replaceState` are picked up on the
// next render, which is all the components using this need.
const subscribe = () => () => {}

/**
 * Read a query string parameter without `useSearchParams()`.
 *
 * In a prerendered page `useSearchParams()` renders the nearest Suspense boundary on the client only, which leaves that
 * content out of the cached HTML that crawlers read. This returns null while prerendering and hydrating, then the
 * value from the URL.
 */
const useSearchParamAfterHydration = (key?: string | false): string | null => {
  return useSyncExternalStore(
    subscribe,
    () => (key ? new URLSearchParams(window.location.search).get(key) : null),
    () => null
  )
}

export default useSearchParamAfterHydration
