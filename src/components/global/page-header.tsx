import MainMenu from "@components/menu/main-menu"
import GlobalMessage from "@components/config-pages/global-message"
import {getConfigPage, getMenu} from "@lib/gql/gql-queries"
import {MenuAvailable, StanfordGlobalMessage} from "@lib/gql/__generated__/drupal.d"
import {isPreviewMode} from "@lib/drupal/utils"
import Link from "@components/elements/link"
import HeaderLogoLg from "@components/images/header-logo-lg"
import HeaderLogoXs from "@components/images/header-logo-xs"

const PageHeader = async () => {
  const menuItems = await getMenu(MenuAvailable.Main, isPreviewMode())
  const globalMessageConfig = await getConfigPage<StanfordGlobalMessage>("StanfordGlobalMessage")

  return (
    <header
      id="site-header"
      className="relative z-[1] border-b border-fog"
    >
      {globalMessageConfig && <GlobalMessage {...globalMessageConfig} />}
      <div className="min-h-50 centered pr-24 lg:pr-0">
        <div className="flex w-full items-center justify-between gap-20">
          <div className="py-10">
            <Link
              href="/"
              className="flex flex-col gap-4 no-underline lg:flex-row"
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
    </header>
  )
}
export default PageHeader
