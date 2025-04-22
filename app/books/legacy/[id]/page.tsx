import {notFound, redirect} from "next/navigation"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"
import {graphqlClient} from "@lib/gql/gql-client"

export const revalidate = false
export const dynamic = "force-static"

const LegacyBookPage = async (props: {params: Promise<{id: string}>}) => {
  const params = await props.params
  const legacyPaths = await getLegacyBookPaths()
  const legacyBook = legacyPaths.find(book => book.id === parseInt(params.id))
  if (legacyBook?.path) redirect(legacyBook.path)

  // New work id, look up to see if one exists.
  const bookData = await graphqlClient({cache: "no-cache"}).supBooks({filters: {work_id: parseInt(params.id)}})
  if (bookData.supBooksView?.results[0]?.__typename === "NodeSupBook" && bookData.supBooksView.results[0].path)
    redirect(bookData.supBooksView.results[0].path)

  notFound()
}

export const generateStaticParams = async (): Promise<Array<{id: string}>> => {
  if (process.env.VERCEL_ENV === "preview") return []
  const params = await getLegacyBookPaths()
  return params.map(item => ({id: item.id.toString()}))
}

export default LegacyBookPage
