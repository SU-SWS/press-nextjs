import {getMenu} from "@lib/gql/gql-queries"
import SideNav from "@components/menu/side-nav"
import {HtmlHTMLAttributes} from "react"
import {MenuAvailable} from "@lib/gql/__generated__/drupal.d"
import {twMerge} from "tailwind-merge"
import getActiveTrail from "@lib/drupal/utils"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Current url path.
   */
  currentPath: string
}

const InteriorPage = async ({children, currentPath, ...props}: Props) => {
  const menu = await getMenu(MenuAvailable.Main)
  const activeTrail: string[] = getActiveTrail(menu, currentPath)

  // Peel off the menu items from the parent.
  const topMenuItem = activeTrail.length > 0 ? menu.find(item => item.id === activeTrail[0]) : undefined
  const subTree = topMenuItem ? topMenuItem.children : []

  return (
    <div {...props} className={twMerge("centered flex gap-[17.1rem]", props.className)}>
      {(subTree.length > 1 || subTree[0]?.children) && (
        <aside className="hidden w-1/4 shrink-0 lg:block">
          <a href="#page-content" className="skiplink">
            Skip secondary navigation
          </a>
          <SideNav menuItems={subTree} activeTrail={activeTrail} />
        </aside>
      )}

      <div className="flex-grow" id="page-content">
        {children}
      </div>
    </div>
  )
}

export default InteriorPage
