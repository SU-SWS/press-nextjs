import {Hit as HitType} from "instantsearch.js/es/types/results";
import {H2} from "@components/elements/headers";
import Link from "@components/elements/link";
import {Snippet} from "react-instantsearch";
import Image from "next/image";
import {AlgoliaHit} from "@components/algolia-search/hits/default";

type BookHit = AlgoliaHit & {
  book_published?: number
  book_authors?: string
}

const SupBookHit = ({hit}: { hit: HitType<BookHit> }) => {
  const hitUrl = new URL(hit.url);

  return (
    <article className="@container py-12">
      <div className="flex flex-col @3xl:flex-row justify-between gap-20">
        <div>
          <H2 className="text-m2">
            <Link className="text-stone-dark hocus:text-digital-red" href={hit.url.replace(hitUrl.origin, "")}>
              {hit.title}
            </Link>
          </H2>

          {hit.summary &&
            <p className="mb-10">{hit.summary}</p>
          }
          {(hit.html && !hit.summary) &&
            <p className="mb-10">
              <Snippet hit={hit} attribute="html"/>
            </p>
          }

          {hit.book_authors &&
            <div>
              {hit.book_authors}
            </div>
          }
          {hit.book_published &&
            <div className="text-stone-dark">
              {hit.book_published}
            </div>
          }
        </div>

        {hit.photo &&
          <div className="relative shrink-0 aspect-[2/3] w-[150px] mx-auto @3xl:ml-auto">
            <Image
              className="object-cover"
              src={hit.photo}
              alt=""
              fill
              sizes="300px"
            />
          </div>
        }
      </div>
    </article>
)
}
export default SupBookHit;