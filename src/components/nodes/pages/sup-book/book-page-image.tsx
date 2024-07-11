import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import Image from "next/image"
import {getPlaceholderImage} from "@lib/utils/placeholder-image"

type Props = {
  node: NodeSupBook
}
const BookPageImage = async ({node}: Props) => {
  const placeholderImage =
    node.supBookImage?.mediaImage.url && (await getPlaceholderImage(node.supBookImage.mediaImage.url))

  return (
    <Image
      className="mb-16"
      src={node.supBookImage?.mediaImage.variations?.[0].url || "/default-book-image.jpg"}
      alt={node.supBookImage?.mediaImage.alt || ""}
      height={node.supBookImage?.mediaImage.height || 600}
      width={node.supBookImage?.mediaImage.width || 400}
      placeholder={placeholderImage ? "blur" : undefined}
      blurDataURL={placeholderImage}
      sizes="400px"
      loading="eager"
    />
  )
}
export default BookPageImage
