"use client"

import Link from "@components/elements/link"
import SiteSearchForm from "@components/search/site-search-form"
import useOutsideClick from "@lib/hooks/useOutsideClick"
import {ChevronDownIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid"
import {MenuItem as MenuItemType} from "@lib/gql/__generated__/graphql"
import {useBoolean, useEventListener} from "usehooks-ts"
import {RefObject, useCallback, useEffect, useId, useLayoutEffect, useRef, useState} from "react"
import {usePathname} from "next/navigation"
import usePageHasTopBanner from "@lib/hooks/usePageHasTopBanner"
import getActiveTrail from "@lib/drupal/utils"
import {ShoppingCartIcon} from "@heroicons/react/24/outline"
import cn from "@lib/utils/className"
import useCartCount from "@lib/hooks/useCartCount"

const menuLevelsToShow = 2

type Props = {
  /**
   * Array of nested menu items.
   */
  menuItems: MenuItemType[]
}

const MainMenu = ({menuItems}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navId = useId()

  const {value: menuOpen, setFalse: closeMenu, toggle: toggleMenu} = useBoolean(false)
  const browserUrl = usePathname()
  const activeTrail = getActiveTrail(menuItems, usePathname() || "")

  useOutsideClick(menuRef, closeMenu)

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menuOpen) return

      closeMenu()
      buttonRef.current?.focus()
    },
    [menuOpen, closeMenu]
  )

  useEffect(() => closeMenu(), [browserUrl, closeMenu])
  useEventListener("keydown", handleEscape, menuRef as RefObject<HTMLDivElement>)
  const pageHasBanner = usePageHasTopBanner()

  return (
    <nav id={navId} className="shrink-0" aria-label="Main Navigation" ref={menuRef}>
      <button
        ref={buttonRef}
        className="group absolute top-40 right-30 flex flex-col items-center sm:top-20 lg:hidden"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close Main Navigation Menu" : "Open Main Navigation Menu"}
      >
        <span className="mb-7.5 flex h-[30px] w-[30px] flex-col items-center justify-center">
          <span
            className={cn("block h-[3px] w-full rounded-xs bg-stone-dark transition-all duration-300 ease-out", {
              "translate-y-10 rotate-45": menuOpen,
              "-translate-y-1.25": !menuOpen,
            })}
          />
          <span
            className={cn("my-7.5 block h-[3px] w-full rounded-xs bg-stone-dark transition-all duration-300 ease-out", {
              "opacity-0": menuOpen,
              "opacity-100": !menuOpen,
            })}
          />
          <span
            className={cn("block h-[3px] w-full rounded-xs bg-stone-dark transition-all duration-300 ease-out", {
              "-translate-y-10 -rotate-45": menuOpen,
              "translate-y-1.25": !menuOpen,
            })}
          />
        </span>
        <span className="group-hocus-visible:underline" aria-hidden>
          {menuOpen ? "Close" : "Menu"}
        </span>
      </button>

      <div
        className={cn(
          "absolute top-full left-0 z-10 hidden w-full items-center bg-black lg:relative lg:flex lg:bg-transparent",
          {
            block: menuOpen,
          }
        )}
      >
        <SiteSearchForm className="px-25 lg:hidden" />
        <ul className="list-unstyled m-0 mt-10 ml-auto flex-wrap p-0 lg:flex lg:justify-end">
          {menuItems.map(item => (
            <MenuItem key={item.id} {...item} activeTrail={activeTrail} level={0} />
          ))}
          <li>
            <Link href="/search" className="group rs-ml-2 hidden h-full items-center lg:flex" title="Search Site">
              <MagnifyingGlassIcon
                width={25}
                className={cn("-translate-y-5 border-b border-transparent", {
                  "text-white group-hocus-visible:border-b-white": pageHasBanner,
                  "text-stone-dark group-hocus-visible:border-b-stone-dark": !pageHasBanner,
                })}
              />
            </Link>
          </li>

          <ShoppingCartLink pageHasBanner={pageHasBanner} />
        </ul>
      </div>
    </nav>
  )
}

const ShoppingCartLink = ({pageHasBanner}: {pageHasBanner: boolean}) => {
  const {cartCount, clearCart} = useCartCount()

  if (!process.env.NEXT_PUBLIC_CART_DOMAIN || cartCount === null) return null

  const cartUrl = process.env.NEXT_PUBLIC_CART_DOMAIN + "/cart"
  return (
    <li>
      <Link
        onClick={e => {
          e.preventDefault()
          // Clear the local storage before going off site to the cart. The cart is
          // on another domain, so we aren't clearing the cart, just the local storage count.
          clearCart()
          window.location.href = cartUrl
        }}
        href={cartUrl}
        className={cn(
          "group relative rs-ml-5 flex h-full min-h-80 items-center border-b border-transparent no-underline lg:rs-ml-2 lg:min-h-0",
          {
            "text-white hocus:text-white": pageHasBanner,
            "text-white lg:text-stone-dark hocus:text-white lg:hocus:text-stone-dark": !pageHasBanner,
          }
        )}
        aria-label="Go to your cart"
      >
        <ShoppingCartIcon
          width={25}
          className={cn("border-b-2 border-transparent lg:-translate-y-7.5", {
            "group-hocus:border-white": pageHasBanner,
            "group-hocus:border-stone-dark": !pageHasBanner,
          })}
        />
        {cartCount > 0 && (
          <span className="absolute top-5 left-20 block lg:-top-7.5" aria-live="polite" aria-atomic>
            {cartCount}
            <span className="sr-only"> items in your cart</span>
          </span>
        )}
        <span className="ml-25 block font-normal group-hocus:underline lg:hidden" aria-hidden>
          View Cart
        </span>
      </Link>
    </li>
  )
}

type MenuItemProps = MenuItemType & {
  activeTrail: string[]
  level: number
}

const MenuItem = ({id, url, title, activeTrail, children, level}: MenuItemProps) => {
  const linkId = useId()
  const menuItemRef = useRef<HTMLLIElement>(null)
  const belowListRef = useRef<HTMLUListElement>(null)

  const [positionRight, setPositionRight] = useState<boolean>(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {value: submenuOpen, setFalse: closeSubmenu, toggle: toggleSubmenu} = useBoolean(false)
  const browserUrl = usePathname()

  useOutsideClick(menuItemRef, closeSubmenu)

  // Close the submenu if the url changes.
  useEffect(() => closeSubmenu(), [browserUrl, closeSubmenu])

  useLayoutEffect(() => {
    // If the right side of the submenu is not visible, set the position to be on the left of the menu item.
    const {x, width} = belowListRef.current?.getBoundingClientRect() || {x: 0, width: 0}

    if (x + width > window.innerWidth) setPositionRight(false)
  }, [submenuOpen])

  // If the user presses escape on the keyboard, close the submenus.
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !submenuOpen) return

      closeSubmenu()
      if (level === 0) buttonRef.current?.focus()
    },
    [level, submenuOpen, closeSubmenu]
  )

  useEventListener("keydown", handleEscape, menuItemRef as unknown as RefObject<HTMLDivElement>)
  const pageHasBanner = usePageHasTopBanner()

  // List out the specific classes so tailwind will include them. Dynamic classes values don"t get compiled.
  const zIndexes = ["z-1", "z-2", "z-3", "z-4", "z-5"]
  const leftPadding = ["pl-25", "pl-50", "pl-70", "pl-120"]

  // The last item in the current trail would be the current item id if the user is on that page.
  const isCurrent = activeTrail.at(-1) === id
  const inTrail = activeTrail.includes(id) && !isCurrent

  const linkStyles = cn(
    "font-normal w-full relative inline-block text-white hocus:text-white no-underline hocus-visible:underline pt-12.5 rs-pb-0 lg:pl-0 border-l-4",
    leftPadding[level],
    // Top menu item styles.
    {
      "lg:text-stone-dark lg:hocus:text-stone-dark": !pageHasBanner,
      "lg:border-l-0 lg:border-b-[6px] ml-12.5 lg:ml-0": level === 0,
      "border-digital-red lg:border-black": !pageHasBanner && level === 0 && isCurrent,
      "border-transparent lg:border-fog-dark": !pageHasBanner && level === 0 && !isCurrent && inTrail,
      "lg:border-white": pageHasBanner && level === 0 && isCurrent,
      "lg:border-fog": pageHasBanner && level === 0 && !isCurrent && inTrail,
      "border-transparent": level === 0 && !isCurrent && !inTrail,
      "flex items-center gap-7.5": title === "Cart",
    },
    // Child menu item styles.
    {
      "ml-12.5 lg:ml-0 lg:pl-12.5": level !== 0,
      "border-digital-red": level !== 0 && isCurrent,
      "border-transparent": level !== 0 && !isCurrent,
    }
  )

  const subMenuStyles = cn(
    "list-unstyled w-full min-w-[300px] lg:bg-white lg:shadow-2xl px-0 lg:hidden lg:absolute",
    zIndexes[level],
    {
      "lg:top-full lg:right-0": level === 0,
      "lg:top-0": level !== 0,
      "lg:left-full": level !== 0 && positionRight,
      "lg:right-full": level !== 0 && !positionRight,
      block: submenuOpen,
      hidden: !submenuOpen,
    }
  )

  return (
    <li
      ref={menuItemRef}
      className={cn(
        "relative m-0 border-b border-cool-grey py-5 text-[.9em] first:border-t last:border-0 lg:relative lg:rs-ml-2 lg:border-black-20 lg:py-0 lg:first:ml-0 2xl:rs-ml-3",
        {"first:border-t-0 lg:border-b-0": level === 0}
      )}
    >
      <div className="flex items-center justify-between lg:justify-end">
        <Link id={linkId} href={url || "#"} className={linkStyles} aria-current={isCurrent ? "true" : undefined}>
          {title}
          {title === "Cart" && <ShoppingCartIcon width={20} className={cn({"text-press-sand-dark": !pageHasBanner})} />}
        </Link>

        {children.length > 0 && level < menuLevelsToShow && (
          <>
            {level === 0 && (
              <div className="mb-[6px] ml-12.5 block h-[25px] w-px shrink-0 bg-archway-light lg:hidden" />
            )}
            <button
              ref={buttonRef}
              className="group relative right-25 shrink-0 rounded-full border-b border-transparent bg-digital-red text-white lg:right-0 lg:hidden lg:rounded-none lg:bg-transparent lg:text-digital-red hocus-visible:border-black hocus-visible:bg-white"
              onClick={toggleSubmenu}
              aria-expanded={submenuOpen}
              aria-labelledby={linkId}
            >
              <ChevronDownIcon
                height={35}
                className={cn("transition duration-300 group-hocus:scale-125 group-hocus-visible:text-black", {
                  "rotate-180": submenuOpen,
                })}
              />
            </button>
          </>
        )}
      </div>

      {children.length > 0 && level < menuLevelsToShow && (
        <ul className={subMenuStyles} ref={belowListRef}>
          {children.map(item => (
            <MenuItem key={item.id} {...item} level={level + 1} activeTrail={activeTrail} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default MainMenu
