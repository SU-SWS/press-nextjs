"use client"

import {useIsClient, useLocalStorage} from "usehooks-ts"
import {useCallback, useEffect} from "react"
import {AddToCartResponse} from "@lib/@types/cart-api"

export type CartCountStorage = {
  count: number | null
  expire: number
}

// 5 minutes
const countLifetime = 5 * 60 * 1000

const useCartCount = (): {
  cartCount: number | null
  setCartCount: (_n: number) => void
  clearCart: () => void
} => {
  const isClient = useIsClient()
  const [storage, setStorage] = useLocalStorage<CartCountStorage>(
    "cart-count",
    {count: null, expire: 0},
    {initializeWithValue: false}
  )

  const setCartCount = useCallback(
    (count: number) => {
      setStorage({count, expire: Date.now() + countLifetime})
    },
    [setStorage]
  )

  useEffect(() => {
    if (!isClient) return

    const cartDomain = process.env.NEXT_PUBLIC_CART_DOMAIN
    if (!cartDomain) {
      console.warn("No cart domain configured")
      return
    }

    if (storage.count === null || storage.expire < Date.now()) {
      fetch(`${cartDomain}/cart-bridge/cart/qty/`, {
        credentials: "include",
        headers: {"X-Requested-With": "XMLHttpRequest"},
      })
        .then(res => {
          if (!res.ok) throw new Error(`Cart API HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then((body: AddToCartResponse) => {
          if (!body.success) throw new Error("Unsuccessful response from cart API")
          setCartCount(body.data.summary_qty || 0)
        })
        .catch(e => {
          console.warn("An error occurred fetching cart count: " + e.toString())
          setCartCount(0)
        })
    }
  }, [isClient, setCartCount, storage.count, storage.expire])

  return {
    cartCount: storage.count,
    setCartCount,
    // Set the expiration to 1 second from now to avoid immediate re-fetch.
    clearCart: () => setStorage({count: storage.count, expire: Date.now() + 1000}),
  }
}
export default useCartCount
