import Image from "next/image"
import InterceptionModal from "@components/elements/interception-modal"
import Link from "@components/elements/link"
import {ParagraphStanfordGallery} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"

type Props = {
  params: Promise<{uuid: string[]}>
}

const Page = async (props: Props) => {
  const params = await props.params
  const [paragraphId, mediaUuid] = params.uuid

  const paragraphQuery = await graphqlClient().Paragraph({uuid: paragraphId})
  if (paragraphQuery.paragraph?.__typename !== "ParagraphStanfordGallery") notFound()

  const paragraph = paragraphQuery.paragraph as ParagraphStanfordGallery

  const currentImageIndex = paragraph.suGalleryImages?.findIndex(image => image.uuid === mediaUuid) || 0
  const prevImageIndex = paragraph.suGalleryImages?.[currentImageIndex - 1] ? currentImageIndex - 1 : -1
  const nextImageIndex = paragraph.suGalleryImages?.[currentImageIndex + 1] ? currentImageIndex + 1 : -1

  let galleryImages = mediaUuid
    ? paragraph.suGalleryImages?.filter(image => image.uuid === mediaUuid)
    : paragraph.suGalleryImages

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <InterceptionModal aria-labelledby={mediaUuid}>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return

        return (
          <div key={galleryImage.uuid}>
            <figure key={galleryImage.uuid}>
              <picture>
                <Image
                  src={galleryImage.suGalleryImage.url}
                  width={galleryImage.suGalleryImage.width}
                  height={galleryImage.suGalleryImage.height}
                  alt={galleryImage.suGalleryImage.alt || ""}
                  className="m-0 h-auto max-w-full p-0"
                />
              </picture>
              {galleryImage.suGalleryCaption && (
                <figcaption id={mediaUuid} className="m-0 table-caption w-full caption-bottom bg-white p-5 text-right">
                  {galleryImage.suGalleryCaption}
                </figcaption>
              )}
            </figure>
            {(prevImageIndex || nextImageIndex) && (
              <nav>
                <ul className="list-unstyled flex justify-between">
                  {prevImageIndex >= 0 && (
                    <li className="mr-auto">
                      <Link
                        className="mt-5 font-medium text-press-sand-light no-underline hocus:text-white hocus:underline"
                        href={`/gallery/${paragraph.uuid}/${paragraph.suGalleryImages?.[prevImageIndex].uuid}`}
                        replace={true}
                        scroll={false}
                      >
                        Previous Image
                      </Link>
                    </li>
                  )}
                  {nextImageIndex >= 0 && (
                    <li className="ml-auto">
                      <Link
                        className="mt-5 font-medium text-press-sand-light no-underline hocus:text-white hocus:underline"
                        href={`/gallery/${paragraph.uuid}/${paragraph.suGalleryImages?.[nextImageIndex].uuid}`}
                        replace={true}
                        scroll={false}
                      >
                        Next Image
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </div>
        )
      })}
    </InterceptionModal>
  )
}
export default Page
