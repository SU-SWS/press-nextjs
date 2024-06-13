import {MenuItem} from "@lib/gql/__generated__/drupal.d"

/**
 * Get an array of menu item ids representing the current page"s location in the main menu.
 *
 * @param menuItems
 *   Array of menu items.
 * @param currentPath
 *   Current page url.
 */
const getActiveTrail = (menuItems: MenuItem[], currentPath?: string) => {
  const getActiveTrailInternal = (menuItems: MenuItem[], trail: string[] = []): string[] => {
    let childTrail, currentTrail
    for (let i = 0; i < menuItems.length; i++) {
      currentTrail = [...trail]
      currentTrail.push(menuItems[i].id)

      if (currentPath === menuItems[i].url) {
        return currentTrail
      }

      const childrenItems = menuItems[i].children

      if (childrenItems) {
        childTrail = getActiveTrailInternal(childrenItems, [...currentTrail])
        if (childTrail.length > 0) {
          return childTrail
        }
      }
    }
    return []
  }

  return getActiveTrailInternal(menuItems)
}

export default getActiveTrail
