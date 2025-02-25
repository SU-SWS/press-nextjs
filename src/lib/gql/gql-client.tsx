import {GraphQLClient} from "graphql-request"
import {getSdk} from "@lib/gql/__generated__/queries"
import {buildHeaders} from "@lib/drupal/utils"
import {INFINITE_CACHE} from "next/dist/lib/constants"

export const graphqlClient = (requestConfig: Omit<RequestInit, "method"> = {}, isPreviewMode?: boolean) => {
  requestConfig.headers = buildHeaders(requestConfig.headers as HeadersInit, isPreviewMode)

  const client = new GraphQLClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/graphql", {
    ...requestConfig,
    next: {revalidate: INFINITE_CACHE, ...requestConfig.next},
    // Use fetch function so Next.js will be able to cache it normally.
    fetch: async (input: URL | RequestInfo, init?: RequestInit) => fetch(input, init),
  })
  return getSdk(client)
}
