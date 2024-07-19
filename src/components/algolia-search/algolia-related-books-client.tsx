"use client"

import algoliasearch from "algoliasearch/lite"
import {RelatedProducts} from "react-instantsearch"
import {InstantSearchNext} from "react-instantsearch-nextjs"
import {H2, H3} from "@components/elements/headers"
import {Maybe} from "@lib/gql/__generated__/drupal"
import {BookHit} from "@components/algolia-search/hits/sup-book"
import {Hit as HitType} from "instantsearch.js/es/types/results"
import Image from "next/image"
import Link from "@components/elements/link"
import {BookmarkIcon} from "@heroicons/react/24/outline"

type Props = {
  objectId: string
  appId?: Maybe<string>
  searchIndex?: Maybe<string>
  searchApiKey?: Maybe<string>
}

const RelatedBook = ({item}: {item: HitType<BookHit>}) => {
  const imageUrl =
    item.photo && item.photo.replace(new URL(item.photo).origin, process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)
  return (
    <div className="mx-auto max-w-3xl">
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

        <H3 className="type-0 mb-5 font-normal">
          <Link
            className="stretched-link font-medium text-stone-dark"
            href={item.url.replace(new URL(item.url).origin, "")}
          >
            {item.title}
          </Link>
        </H3>
      </div>

      {item.book_subtitle && <div className="rs-mb-3 text-press-sand-dark">{item.book_subtitle}</div>}

      {item.book_authors && <div className="mb-0 text-press-sand-dark">{item.book_authors}</div>}
    </div>
  )
}

const RelatedBooks = ({objectId, appId, searchIndex, searchApiKey}: Props) => {
  if (!objectId || !appId || !searchIndex || !searchApiKey) return

  const searchClient = algoliasearch(appId, searchApiKey)

  return (
    <InstantSearchNext
      indexName={searchIndex}
      searchClient={searchClient}
      future={{preserveSharedStateOnUnmount: true}}
    >
      <RelatedProducts
        objectIDs={[objectId]}
        itemComponent={RelatedBook}
        limit={5}
        classNames={{
          root: "centered border-t-2 border-press-sand-dark mt-64",
          list: "w-11/12 mx-auto list-unstyled grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
        }}
        queryParameters={{
          filters: "book_type:book",
        }}
        headerComponent={() => <H2 className="mb-32 mt-16 font-medium text-stone-dark">Explore more</H2>}
        emptyComponent={() => <></>}
      />
    </InstantSearchNext>
  )
}

export default RelatedBooks
