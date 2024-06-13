import LocalFooter from "@components/config-pages/local-footer"
import SuperFooter from "@components/config-pages/super-footer"
import {getConfigPage} from "@lib/gql/gql-queries"
import {StanfordLocalFooter, StanfordSuperFooter} from "@lib/gql/__generated__/drupal.d"

const PageFooter = async () => {
  const superFooterConfig = await getConfigPage<StanfordSuperFooter>("StanfordSuperFooter")
  const localFooterConfig = await getConfigPage<StanfordLocalFooter>("StanfordLocalFooter")

  return (
    <footer>
      {superFooterConfig && <SuperFooter {...superFooterConfig} />}
      {localFooterConfig && <LocalFooter {...localFooterConfig} />}
    </footer>
  )
}
export default PageFooter
