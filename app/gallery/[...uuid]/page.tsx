import {H1} from "@components/elements/headers"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {ParagraphStanfordGallery} from "@lib/gql/__generated__/drupal.d"
import Image from "next/image"
import {cacheTag} from "next/cache"

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

const Page = async (props: Props) => {
  "use cache: remote"

  const params = await props.params
  const [paragraphId, mediaUuid] = params.uuid

  cacheTag("paragraphs", `paragraphs:${paragraphId}`)

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

export default Page
