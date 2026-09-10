import {H1} from "@components/elements/headers"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {ParagraphStanfordGallery} from "@lib/gql/__generated__/drupal.d"
import Image from "next/image"
import {cacheTag} from "next/cache"
import {Suspense} from "react"

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
  const paragraphQuery = await graphqlClient().Paragraph({uuid: paragraphId})
  if (paragraphQuery.paragraph?.__typename === "ParagraphStanfordGallery")
    return paragraphQuery.paragraph as ParagraphStanfordGallery
  return false
}

export const generateStaticParams = (): Array<Param> => {
  return [{uuid: ["/"]}]
}

const Page = (props: Props) => {
  return (
    <Suspense fallback={<GalleryPageSkeleton />}>
      <GalleryContents params={props.params} />
    </Suspense>
  )
}

/**
 * Everything below depends on the requested paragraph uuid, so it streams in
 * behind the suspense boundary above and keeps the navigation into this route
 * instant.
 */
const GalleryContents = async ({params: paramsPromise}: {params: Props["params"]}) => {
  const params = await paramsPromise
  const [paragraphId, mediaUuid] = params.uuid

  const paragraph = await getGallery(paragraphId)
  if (!paragraph) return notFound()
  let galleryImages = mediaUuid
    ? paragraph.suGalleryImages?.filter(image => image.uuid === mediaUuid)
    : paragraph.suGalleryImages

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <div className="centered mt-32">
      <H1>{paragraph.suGalleryHeadline || "Media"}</H1>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return

        return (
          <figure key={galleryImage.uuid}>
            <Image
              src={galleryImage.suGalleryImage.url}
              width={galleryImage.suGalleryImage.width}
              height={galleryImage.suGalleryImage.height}
              alt={""}
            />

            {galleryImage.suGalleryCaption && <figcaption>{galleryImage.suGalleryCaption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}

/**
 * Placeholder for the gallery headline and a single image while the paragraph
 * is fetched from Drupal. The image count isn't known until then, so only one
 * figure is drawn.
 */
const GalleryPageSkeleton = () => {
  return (
    <div className="centered mt-32" role="status" aria-label="Loading gallery">
      <div className="rs-mb-4 h-[60px] w-full max-w-[500px] bg-black-10" aria-hidden />

      <div className="aspect-[16/9] w-full bg-black-10" aria-hidden />
      <div className="mt-5 h-[20px] w-1/2 bg-black-10" aria-hidden />
    </div>
  )
}

export default Page
