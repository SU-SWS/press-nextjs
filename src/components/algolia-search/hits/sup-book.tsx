import {Hit as HitType} from "instantsearch.js/es/types/results"
import {H3} from "@components/elements/headers"
import Link from "@components/elements/link"
import {Snippet} from "react-instantsearch"
import Image from "next/image"
import {AlgoliaHit} from "@components/algolia-search/hits/default"
import clsx from "clsx"
import {twMerge} from "tailwind-merge"

export type BookHit = AlgoliaHit & {
  book_published?: number
  book_authors?: string
  book_type?: "book" | "digital_project"
  book_authors_last_name?: string | string[]
  book_imprint?: string[]
  book_subject?: string[]
  book_subject_all?: string[]
  book_series?: string[]
  book_subtitle?: string
  book_award_winner?: boolean
}

const SupBookHit = ({hit}: {hit: HitType<BookHit>}) => {
  const hitUrl = new URL(hit.url)
  const url = hit.url.replace(hitUrl.origin, "")
  return (
    <article className="py-12 @container">
      <div className="flex flex-col justify-between gap-20 @2xl:flex-row">
        <div>
          <H3 className="type-0 mb-2" id={hit.objectID}>
            <Link className="text-stone-dark hocus:text-digital-red" href={url} prefetch={false}>
              {hit.title}
            </Link>
          </H3>

          {hit.summary && <p className="card-paragraph mb-8">{hit.summary}</p>}
          {hit.html && !hit.summary && (
            <p className="card-paragraph mb-8">
              <Snippet hit={hit} attribute="html" />
            </p>
          )}

          {hit.book_authors && <div className="text-18">{hit.book_authors}</div>}
          {hit.book_published && <div className="text-18">{hit.book_published}</div>}
        </div>

        {hit.photo && (
          <Link
            href={url}
            aria-hidden
            tabIndex={-1}
            prefetch={false}
            className={twMerge(
              "relative mx-auto shrink-0 @2xl:mr-0",
              clsx({
                "aspect-[2/3] w-[150px]": hit.book_type === "book",
                "aspect-[4/3] h-[150px]": hit.book_type === "digital_project",
              })
            )}
          >
            <Image
              className="object-cover"
              src={hit.photo.replace(hitUrl.origin, process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)}
              alt=""
              fill
              sizes="300px"
            />
          </Link>
        )}
      </div>
    </article>
  )
}
export default SupBookHit
