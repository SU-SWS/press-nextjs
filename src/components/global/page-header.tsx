import MainMenu from "@components/menu/main-menu"
import GlobalMessage from "@components/config-pages/global-message"
import {getMenu} from "@lib/gql/gql-queries"
import {MenuAvailable} from "@lib/gql/__generated__/drupal.d"
import Link from "@components/elements/link"
import HeaderLogoLg from "@components/images/header-logo-lg"
import HeaderLogoXs from "@components/images/header-logo-xs"
import HeaderForCarousel from "@components/global/header-for-carousel"

const PageHeader = async () => {
  const menuItems = await getMenu(MenuAvailable.Main)

  return (
    <HeaderForCarousel id="site-header">
      <GlobalMessage />
      <div className="min-h-50 relative z-[2] border-b border-fog">
        <div className="centered flex w-full items-center justify-between gap-20 pr-24 lg:pr-0">
          <div className="rs-pt-0 rs-pb-1 lg:rs-pt-1 lg:rs-pb-2">
            <Link
              href="/"
              className="flex flex-col gap-4 no-underline lg:flex-row"
              aria-label="Stanford University Press Home"
            >
              <div className="hidden sm:block">
                <HeaderLogoLg />
              </div>
              <div className="sm:hidden">
                <HeaderLogoXs />
              </div>
            </Link>
          </div>

          <MainMenu menuItems={menuItems} />
        </div>
      </div>
    </HeaderForCarousel>
  )
}
export default PageHeader
