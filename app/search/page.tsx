import {H1} from "@components/elements/headers"
import {getAlgoliaCredential} from "@lib/gql/gql-queries"
import {IndexUiState} from "instantsearch.js/es/types/ui-state"
import AlgoliaSearchForm from "@components/algolia-search/algolia-search-form"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false

export const metadata = {
  title: "Search",
  description: "Search the site",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}
const Page = async (props: {searchParams?: Promise<{[_key: string]: string}>}) => {
  const searchParams = await props.searchParams
  const [appId, indexName, apiKey] = await getAlgoliaCredential()

  const initialState: IndexUiState = {refinementList: {book_type: ["book"]}}
  if (searchParams?.q) initialState.query = searchParams.q
  if (searchParams?.subjects && initialState.refinementList) {
    initialState.refinementList.book_subject = searchParams.subjects.split(",")
  }

  if (!!searchParams?.["only-books"] && initialState.refinementList) {
    delete initialState.refinementList.book_type
  }
  if (searchParams?.["published-min"] || searchParams?.["published-max"]) {
    initialState.range = {
      book_published: (searchParams["published-min"] || "0") + ":" + (searchParams["published-max"] || "3000"),
    }
  }

  return (
    <div className="centered mt-32">
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="rs-mb-2" id="page-title">
          Search our site
        </H1>

        {appId && indexName && initialState && apiKey && (
          <AlgoliaSearchForm
            appId={appId}
            searchIndex={indexName}
            searchApiKey={apiKey}
            initialUiState={initialState}
          />
        )}
        <noscript>Please enable javascript to view search results</noscript>
      </div>
    </div>
  )
}

export default Page
