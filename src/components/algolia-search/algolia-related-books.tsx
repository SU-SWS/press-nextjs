import {getConfigPage} from "@lib/gql/gql-queries"
import {NodeSupBook, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal"
import RelatedBooks from "@components/algolia-search/algolia-related-books-client"

const AlgoliaRelatedBooks = async ({objectId}: {objectId: NodeSupBook["id"]}) => {
  const siteSettings = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")

  if (!siteSettings?.suSiteAlgoliaId || !siteSettings.suSiteAlgoliaIndex || !siteSettings.suSiteAlgoliaSearch) return

  return (
    <RelatedBooks
      objectId={objectId}
      appId={siteSettings.suSiteAlgoliaId}
      searchIndex={siteSettings.suSiteAlgoliaIndex}
      searchApiKey={siteSettings.suSiteAlgoliaSearch}
    />
  )
}

export default AlgoliaRelatedBooks
