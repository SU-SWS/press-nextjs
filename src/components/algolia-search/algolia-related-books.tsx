import {NodeSupBook} from "@lib/gql/__generated__/graphql"
import {BookHit} from "@components/algolia-search/hits/sup-book"
import {H2, H3} from "@components/elements/headers"
import Image from "@components/images/image"
import {BookmarkIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import {cacheFailure, getAlgoliaCredential} from "@lib/gql/gql-queries"
import {RecommendHit} from "algoliasearch/lite"
import {cacheLife, cacheTag} from "next/cache"

// Only the fields the related book card renders. Requesting just these keeps the Algolia response, and the months-long
// remote cache entry built from it, small instead of carrying each book's full indexed html.
const RELATED_BOOK_ATTRIBUTES = ["title", "url", "photo", "book_subtitle", "book_authors", "book_award_winner"] as const

type RelatedBookHit = Pick<BookHit, "objectID" | (typeof RELATED_BOOK_ATTRIBUTES)[number]>

const getRelatedContent = async (objectID: string): Promise<RelatedBookHit[]> => {
  "use cache: remote"
  cacheTag("related-books", `related-books:${objectID}`)
  cacheLife("months")

  const [appID, indexName, apiKey, useRelatedContent] = await getAlgoliaCredential()
  if (!appID || !indexName || !apiKey || !useRelatedContent) return []

  try {
    const response = await fetch(`https://${appID}-dsn.algolia.net/1/indexes/*/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Algolia-Application-Id": appID,
        "X-Algolia-API-Key": apiKey,
      },
      body: JSON.stringify({
        requests: [
          {
            indexName,
            model: "related-products",
            maxRecommendations: 5,
            threshold: 0,
            objectID,
            queryParameters: {
              filters: "book_type:book",
              attributesToRetrieve: RELATED_BOOK_ATTRIBUTES,
              attributesToHighlight: [],
              attributesToSnippet: [],
            },
          },
        ],
      }),
    })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)

    const recommendations: {results?: {hits?: RecommendHit[]}[]} = await response.json()
    const hits = (recommendations.results?.[0]?.hits || []) as BookHit[]

    return hits
      .filter(hit => hit.url && hit.title)
      .map(hit => ({
        objectID: hit.objectID,
        title: hit.title,
        url: hit.url,
        photo: hit.photo,
        book_subtitle: hit.book_subtitle,
        book_authors: hit.book_authors,
        book_award_winner: hit.book_award_winner,
      }))
  } catch (e) {
    // Keep a failed lookup out of the months-long cache so the next request after an Algolia hiccup retries it.
    cacheFailure(`Unable to fetch related books for ${objectID}`, e)
    return []
  }
}

const AlgoliaRelatedBooks = async ({objectId}: {objectId: NodeSupBook["id"]}) => {
  const recommendations = await getRelatedContent(objectId)
  if (recommendations.length === 0) return

  return (
    <section aria-labelledby={`${objectId}-related`} className="mt-160 centered border-t-2 border-press-sand-dark">
      <H2 id={`${objectId}-related`} className="mt-40 mb-80 font-medium text-stone-dark">
        Explore more
      </H2>
      <ul className="list-unstyled mx-auto grid w-11/12 grid-cols-1 gap-25 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {recommendations.map(rec => (
          <RelatedBook key={rec.objectID} item={rec} />
        ))}
      </ul>
    </section>
  )
}

const RelatedBook = ({item}: {item: RelatedBookHit}) => {
  const imageUrl =
    item.photo && item.photo.replace(new URL(item.photo).origin, process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)
  return (
    <li className="mx-auto w-full max-w-3xl">
      <div className="relative">
        <div className="relative rs-mb-1 aspect-2/3 w-full">
          <Image
            className="ed11y-ignore object-cover"
            src={imageUrl || "/default-book-image.jpg"}
            alt=""
            fill
            sizes="400px"
          />
          {item.book_award_winner && (
            <div className="absolute top-0 left-12.5 flex max-w-[90%] items-center gap-7.5 bg-fog py-5 pr-12.5 pl-7.5">
              <BookmarkIcon width={20} className="fill-stone-dark" />
              Award winner
            </div>
          )}
        </div>

        <H3 className="mb-12.5 type-0 font-normal xl:text-21">
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
