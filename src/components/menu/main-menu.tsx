"use client"

import Link from "@components/elements/link"
import SiteSearchForm from "@components/search/site-search-form"
import useOutsideClick from "@lib/hooks/useOutsideClick"
import {ChevronDownIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid"
import {MenuItem as MenuItemType} from "@lib/gql/__generated__/drupal.d"
import {clsx} from "clsx"
import {useBoolean, useEventListener} from "usehooks-ts"
import {useCallback, useEffect, useId, useLayoutEffect, useRef, useState} from "react"
import {usePathname} from "next/navigation"
import usePageHasTopBanner from "@lib/hooks/usePageHasTopBanner"
import getActiveTrail from "@lib/drupal/utils"
import {ShoppingCartIcon} from "@heroicons/react/24/outline"

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
  useEventListener("keydown", handleEscape, menuRef)
  const pageHasBanner = usePageHasTopBanner()

  return (
    <nav id={navId} aria-label="Main Navigation" ref={menuRef}>
      <button
        ref={buttonRef}
        className="group flex w-0 flex-col items-center lg:hidden"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-labelledby={navId}
      >
        <span className="flex h-[30px] w-[30px] flex-col items-center justify-center">
          <span
            className={clsx("block h-[3px] w-full rounded-sm bg-stone-dark transition-all duration-300 ease-out", {
              "translate-y-4 rotate-45": menuOpen,
              "-translate-y-0.5": !menuOpen,
            })}
          />
          <span
            className={clsx("my-3 block h-[3px] w-full rounded-sm bg-stone-dark transition-all duration-300 ease-out", {
              "opacity-0": menuOpen,
              "opacity-100": !menuOpen,
            })}
          />
          <span
            className={clsx("block h-[3px] w-full rounded-sm bg-stone-dark transition-all duration-300 ease-out", {
              "-translate-y-4 -rotate-45": menuOpen,
              "translate-y-0.5": !menuOpen,
            })}
          />
        </span>
        <span className="group-hocus:underline" aria-hidden>
          {menuOpen ? "Close" : "Menu"}
        </span>
      </button>

      <div
        className={
          (menuOpen ? "block" : "hidden") +
          " absolute left-0 top-full z-10 w-full items-center bg-black lg:relative lg:flex lg:bg-transparent"
        }
      >
        <SiteSearchForm className="px-10 lg:hidden" />
        <ul className="list-unstyled m-0 ml-auto flex-wrap p-0 lg:flex lg:justify-end">
          {menuItems.map(item => (
            <MenuItem key={item.id} {...item} activeTrail={activeTrail} level={0} />
          ))}
        </ul>

        <a href="/search" className="group rs-ml-2 hidden lg:block" title="Search Site">
          <MagnifyingGlassIcon
            width={25}
            className={clsx("border-b border-transparent", {
              "text-white group-hocus:border-b-white": pageHasBanner,
              "text-stone-dark group-hocus:border-b-stone-dark": !pageHasBanner,
            })}
          />
        </a>
      </div>
    </nav>
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

  useEventListener("keydown", handleEscape, menuItemRef)
  const pageHasBanner = usePageHasTopBanner()

  // List out the specific classes so tailwind will include them. Dynamic classes values don"t get compiled.
  const zIndexes = ["z-[1]", "z-[2]", "z-[3]", "z-[4]", "z-[5]"]
  const leftPadding = ["pl-10", "pl-20", "pl-28", "pl-48"]

  // The last item in the current trail would be the current item id if the user is on that page.
  const isCurrent = activeTrail.at(-1) === id
  const inTrail = activeTrail.includes(id) && !isCurrent

  const linkStyles = clsx(
    "font-normal w-full relative inline-block text-white hocus:text-white no-underline hocus:underline pt-5 rs-pb-0 lg:pl-0 border-l-[4px]",
    leftPadding[level],
    // Top menu item styles.
    {
      "lg:text-stone-dark lg:hocus:text-stone-dark": !pageHasBanner,
      "lg:border-l-0 lg:border-b-[6px] ml-5 lg:ml-0": level === 0,
      "border-digital-red lg:border-black": !pageHasBanner && level === 0 && isCurrent,
      "border-transparent lg:border-foggy-dark": !pageHasBanner && level === 0 && !isCurrent && inTrail,
      "lg:border-white": pageHasBanner && level === 0 && isCurrent,
      "lg:border-fog": pageHasBanner && level === 0 && !isCurrent && inTrail,
      "border-transparent": level === 0 && !isCurrent && !inTrail,
      "flex items-center gap-3": title === "Cart",
    },
    // Child menu item styles.
    {
      "ml-5 lg:ml-0 lg:pl-5": level !== 0,
      "border-digital-red": level !== 0 && isCurrent,
      "border-transparent": level !== 0 && !isCurrent,
    }
  )

  const subMenuStyles = clsx(
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
      className={clsx(
        "relative m-0 border-b border-cool-grey py-2 lg:rs-ml-2 2xl:rs-ml-3 first:border-t last:border-0 lg:relative lg:border-black-20 lg:py-0 first:lg:ml-0",
        {"first:border-t-0 lg:border-b-0": level === 0}
      )}
    >
      <div className="flex items-center justify-between lg:justify-end">
        <Link id={linkId} href={url || "#"} className={linkStyles} aria-current={isCurrent ? "true" : undefined}>
          {title}
          {title === "Cart" && (
            <ShoppingCartIcon width={20} className={clsx({"text-press-sand-dark": !pageHasBanner})} />
          )}
        </Link>

        {children.length > 0 && level < menuLevelsToShow && (
          <>
            {level === 0 && (
              <div className="mb-[6px] ml-5 block h-[25px] w-[1px] shrink-0 bg-archway-light lg:hidden" />
            )}
            <button
              ref={buttonRef}
              className="group relative right-10 shrink-0 rounded-full border-b border-transparent bg-digital-red text-white hocus:border-black hocus:bg-white lg:right-0 lg:hidden lg:rounded-none lg:bg-transparent lg:text-digital-red"
              onClick={toggleSubmenu}
              aria-expanded={submenuOpen}
              aria-labelledby={linkId}
            >
              <ChevronDownIcon
                height={35}
                className={clsx("transition duration-150 ease-in-out group-hocus:scale-125 group-hocus:text-black", {
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
