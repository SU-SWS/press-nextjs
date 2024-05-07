import {H1} from "@components/elements/headers";
import {getConfigPage} from "@lib/gql/gql-queries";
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d";
import AlgoliaSearch from "./algolia-search";
import {IndexUiState} from "instantsearch.js/es/types/ui-state";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false;

export const metadata = {
  title: "Search",
  description: "Search the site",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  }
}
const Page = async ({searchParams}: { searchParams?: { [_key: string]: string } }) => {

  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")

  const initialState: IndexUiState = {refinementList: {}}
  if (searchParams?.q) initialState.query = searchParams.q as string
  if (searchParams?.subjects && initialState.refinementList) {
    initialState.refinementList.book_subject = searchParams.subjects.split(",")
  }
  if (!!searchParams?.books && initialState.refinementList) {
    initialState.refinementList.book_type = ["book"]
  }
  if (searchParams?.["published-min"] || searchParams?.["published-max"]) {
    initialState.range = {book_published: (searchParams["published-min"] || "0") + ":" + (searchParams["published-max"] || "3000")}
  }

  return (
    <div className="centered mt-32">
      <div className="lg:w-4/5 mx-auto">
        <H1 className="mb-44" id="page-title">Search</H1>

        {(siteSettingsConfig?.suSiteAlgoliaId && siteSettingsConfig?.suSiteAlgoliaIndex && siteSettingsConfig?.suSiteAlgoliaSearch) &&
          <>
            <AlgoliaSearch
              appId={siteSettingsConfig.suSiteAlgoliaId}
              searchIndex={siteSettingsConfig.suSiteAlgoliaIndex}
              searchApiKey={siteSettingsConfig.suSiteAlgoliaSearch}
              initialUiState={initialState}
            />
            <noscript>Please enable javascript to view search results</noscript>
          </>
        }
      </div>
    </div>
  )
}

export default Page;