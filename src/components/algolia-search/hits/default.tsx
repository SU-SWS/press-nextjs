import {Hit as HitType} from "instantsearch.js/es/types/results";
import {H2} from "@components/elements/headers";
import Link from "@components/elements/link";
import {Snippet} from "react-instantsearch";
import Image from "next/image";
import SupBookHit from "@components/algolia-search/hits/sup-book";

export type AlgoliaHit = {
  url: string
  title: string
  type: string
  summary?: string
  photo?: string
  updated?: number
  html?: string
}

const DefaultHit = ({hit}: { hit: HitType<AlgoliaHit> }) => {
  if (hit.type === "Book") return <SupBookHit hit={hit}/>

  const hitUrl = new URL(hit.url);

  return (
    <article className="@container py-12">
      <div className="flex flex-col @3xl:flex-row justify-between gap-20">
        <div>
          <H2 className="text-m1">
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

          {hit.updated &&
            <div>
              Last updated: {new Date(hit.updated * 1000).toLocaleDateString("en-us", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
            </div>
          }
        </div>

        {hit.photo &&
          <div className="relative shrink-0 aspect-[2/3] w-[150px]">
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
export default DefaultHit;