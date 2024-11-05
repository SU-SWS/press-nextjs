import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import {unstable_cache as nextCache} from "next/cache"
import {BookHit} from "@components/algolia-search/hits/sup-book"
import {H2, H3} from "@components/elements/headers"
import Image from "next/image"
import {BookmarkIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import {getAlgoliaCredential} from "@lib/gql/gql-queries"
import {RecommendHit} from "algoliasearch/lite"

const getRelatedContent = nextCache(
  async (objectID: string): Promise<BookHit[]> => {
    const [appID, indexName, apiKey, useRelatedContent] = await getAlgoliaCredential()
    if (!appID || !indexName || !apiKey || !useRelatedContent) return []

    const options: RequestInit = {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Algolia-Application-Id": appID,
        "X-Algolia-API-Key": apiKey,
      },
      body: JSON.stringify({
        requests: [
          {
            indexName: indexName,
            model: "related-products",
            maxRecommendations: 5,
            threshold: 0,
            objectID,
            queryParameters: {
              filters: "book_type:book",
            },
          },
        ],
      }),
    }

    const recommendations: {results: RecommendHit[]} = await fetch(
      `https://${appID}-dsn.algolia.net/1/indexes/*/recommendations`,
      options
    ).then(res => res.json())

    const hits = (recommendations?.results?.[0].hits as BookHit[]) || []
    hits.map(hit => {
      delete hit._highlightResult
      delete hit._snippetResult
    })
    return hits
  },
  ["related-books"],
  {revalidate: 2592000, tags: ["related-books"]}
)

const AlgoliaRelatedBooks = async ({objectId}: {objectId: NodeSupBook["id"]}) => {
  const recommendations = await getRelatedContent(objectId)
  if (recommendations.length === 0) return

  return (
    <section aria-labelledby={`${objectId}-related`} className="centered mt-64 border-t-2 border-press-sand-dark">
      <H2 id={`${objectId}-related`} className="mb-32 mt-16 font-medium text-stone-dark">
        Explore more
      </H2>
      <ul className="list-unstyled mx-auto grid w-11/12 grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {recommendations.map(rec => (
          <RelatedBook key={rec.objectID} item={rec} />
        ))}
      </ul>
    </section>
  )
}

const RelatedBook = ({item}: {item: BookHit}) => {
  const imageUrl =
    item.photo && item.photo.replace(new URL(item.photo).origin, process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)
  return (
    <li className="mx-auto max-w-3xl">
      <div className="relative">
        <div className="rs-mb-1 relative aspect-[2/3] w-full">
          <Image
            className="ed11y-ignore object-cover"
            src={imageUrl || "/default-book-image.jpg"}
            alt=""
            fill
            sizes="400px"
          />
          {item.book_award_winner && (
            <div className="absolute left-5 top-0 flex max-w-[90%] items-center gap-3 bg-fog py-2 pl-3 pr-5">
              <BookmarkIcon width={20} className="fill-stone-dark" />
              Award winner
            </div>
          )}
        </div>

        <H3 className="type-0 mb-5 font-normal xl:text-21">
          <Link
            className="stretched-link font-medium text-stone-dark"
            href={item.url.replace(new URL(item.url).origin, "")}
          >
            {item.title}
          </Link>
        </H3>
      </div>

      {item.book_subtitle && <div className="rs-mb-0 text-[0.8em] text-press-sand-dark">{item.book_subtitle}</div>}

      {item.book_authors && <div className="mb-0 text-[0.8em] text-press-sand-dark">{item.book_authors}</div>}
    </li>
  )
}

export default AlgoliaRelatedBooks
