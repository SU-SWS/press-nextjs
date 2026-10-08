import {H1} from "@components/elements/headers"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {ParagraphStanfordGallery, ParagraphDocument, ParagraphQuery} from "@lib/gql/__generated__/graphql"
import Image from "@components/images/image"
import {cacheTag} from "next/cache"
import {isUuid} from "@lib/utils/request-guards"

export const instant = false

export const metadata = {
  title: "Gallery Image",
  robots: {
    index: false,
  },
}

type Param = {uuid: string[]}

type Props = {
  params: Promise<Param>
}

const getGallery = async (paragraphId: string): Promise<ParagraphStanfordGallery | false> => {
  "use cache: remote"
  cacheTag("paragraphs", `paragraphs:${paragraphId}`)
  const paragraphQuery = await graphqlClient().request<ParagraphQuery>(ParagraphDocument, {uuid: paragraphId})
  if (paragraphQuery.paragraph?.__typename === "ParagraphStanfordGallery")
    return paragraphQuery.paragraph as ParagraphStanfordGallery
  return false
}

export const generateStaticParams = (): Array<Param> => {
  return [{uuid: ["/"]}]
}

/**
 * Resolved outside of a Suspense boundary so `notFound()` runs before streaming starts and an unknown gallery returns
 * a real 404 instead of a 200 soft-404 that crawlers keep requesting.
 */
const Page = async ({params: paramsPromise}: Props) => {
  const params = await paramsPromise
  const [paragraphId, mediaUuid] = params.uuid

  // Reject malformed ids before they reach Drupal or create a cache entry.
  if (!isUuid(paragraphId) || (mediaUuid && !isUuid(mediaUuid))) notFound()

  const paragraph = await getGallery(paragraphId)
  if (!paragraph) notFound()

  let galleryImages = mediaUuid
    ? paragraph.suGalleryImages?.filter(image => image.uuid === mediaUuid)
    : paragraph.suGalleryImages

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <div className="mt-80 centered">
      <H1>{paragraph.suGalleryHeadline || "Media"}</H1>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return

        return (
          <figure key={galleryImage.uuid}>
            <Image
              src={galleryImage.suGalleryImage.url}
              width={galleryImage.suGalleryImage.width}
              height={galleryImage.suGalleryImage.height}
              sizes="(max-width: 1200px) 100vw, 1200px"
              alt={""}
            />

            {galleryImage.suGalleryCaption && <figcaption>{galleryImage.suGalleryCaption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}

export default Page
