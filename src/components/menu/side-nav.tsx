import Link from "@components/elements/link";
import {clsx} from "clsx";
import {MenuItem as MenuItemType} from "@lib/gql/__generated__/drupal.d";
import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLElement> & {
  /**
   * Array of nested menu items.
   */
  menuItems: MenuItemType[]
  /**
   * The trail of the current page within the menu items.
   */
  activeTrail: string[]
}

const SideNav = ({menuItems, activeTrail, ...props}: Props) => {
  return (
    <nav aria-label="Secondary Navigation" {...props}>
      <ul className="list-unstyled">
        {menuItems.map(item =>
          <MenuItem key={`sidenav--${item.id}`} {...item} activeTrail={activeTrail} level={0}/>
        )}
      </ul>
    </nav>
  )
}

type MenuItemProps = MenuItemType & {
  activeTrail: string[]
  level: number
}

const MenuItem = ({id, url, title, children, activeTrail, level}: MenuItemProps) => {
  // Need to list them out each so tailwind will include each for styling.
  const leftPadding = [
    "pl-10",
    "pl-20",
    "pl-28",
    "pl-48",
  ]

  const linkClasses = clsx(
    leftPadding[level],
    // Normal styles.
    "w-full inline-block relative no-underline hocus:underline pl-10 py-5 my-1",
    {
      // Non-active state.
      "font-normal text-stone-dark hocus:text-archway-dark hocus:font-medium":  !activeTrail.includes(id) && activeTrail.at(-1) !== id,
      "font-semibold text-stone-dark hocus:text-archway-dark hocus:font-medium hocus:before:content-[''] before:block before:w-[1px] before:h-full before:bg-stone-dark before:absolute before:left-0 before:top-0 before:scale-y-[1] before:transition": activeTrail.includes(id) && activeTrail.at(-1) !== id,
      // Active state.
      "font-semibold text-stone-dark before:content-[''] before:block before:w-[6px] before:h-full before:bg-stone-dark before:absolute before:left-0 before:top-0": activeTrail.at(-1) === id
    }
  )

  return (
    <li className="m-0 p-0 border-b border-fog last:border-0">
      <Link
        href={url || "#"}
        className={linkClasses}
        aria-current={activeTrail.at(-1) === id ? "true" : undefined}
      >
        {title}
      </Link>
      {(children && children.length > 0 && activeTrail.includes(id)) &&
        <ul className="border-t list-unstyled">
          {children.map(item =>
            <MenuItem key={item.id} {...item} level={level + 1} activeTrail={activeTrail}/>
          )}
        </ul>
      }
    </li>
  )
}

export default SideNav;