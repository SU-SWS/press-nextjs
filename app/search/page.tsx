import {H1} from "@components/elements/headers"
import {getAlgoliaCredential} from "@lib/gql/gql-queries"
import AlgoliaSearchForm from "@components/algolia-search/algolia-search-form"
import {Suspense} from "react"

export const metadata = {
  title: "Search",
  description: "Search the site",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}
const Page = async () => {
  "use cache"

  const [appId, indexName, apiKey] = await getAlgoliaCredential()

  return (
    <div className="centered mt-32">
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="rs-mb-2" id="page-title">
          Search our site
        </H1>

        {appId && indexName && apiKey && (
          <Suspense>
            <AlgoliaSearchForm appId={appId} searchIndex={indexName} searchApiKey={apiKey} />
          </Suspense>
        )}
        <noscript>Please enable javascript to view search results</noscript>
      </div>
    </div>
  )
}

export default Page
