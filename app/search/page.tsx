import {H1} from "@components/elements/headers"
import {getAlgoliaCredential} from "@lib/gql/gql-queries"
import AlgoliaSearchForm from "@components/algolia-search/algolia-search-form"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false
export const dynamic = "force-static"

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
  const [appId, indexName, apiKey] = await getAlgoliaCredential()

  return (
    <div className="centered mt-32">
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="rs-mb-2" id="page-title">
          Search our site
        </H1>

        {appId && indexName && apiKey && (
          <AlgoliaSearchForm appId={appId} searchIndex={indexName} searchApiKey={apiKey} />
        )}
        <noscript>Please enable javascript to view search results</noscript>
      </div>
    </div>
  )
}

export default Page
