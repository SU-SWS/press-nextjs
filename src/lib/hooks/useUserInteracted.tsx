"use client"

import {useEffect, useState} from "react"

// Input events a person produces almost immediately on arrival and headless crawlers rarely do. `scroll` is left out
// on purpose: scripted scrolling fires it too, while real scrolling also fires `wheel` or `touchstart`.
const INTERACTION_EVENTS = ["pointermove", "pointerdown", "keydown", "touchstart", "wheel"] as const

/**
 * Report whether the visitor has interacted with the page yet.
 *
 * Used to defer requests that only a person needs, so bots that load a page without interacting don't trigger them.
 */
const useUserInteracted = (): boolean => {
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (interacted) return

    const onInteraction = () => setInteracted(true)
    INTERACTION_EVENTS.forEach(event => window.addEventListener(event, onInteraction, {once: true, passive: true}))
    return () => INTERACTION_EVENTS.forEach(event => window.removeEventListener(event, onInteraction))
  }, [interacted])

  return interacted
}

export default useUserInteracted
