import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import Image from "next/image"
import {getImagePlaceholder} from "@lib/utils/placeholder-image"

type Props = {
  node: NodeSupBook
}
const BookPageImage = async ({node}: Props) => {
  const placeholderImage =
    node.supBookImage?.mediaImage.url && (await getImagePlaceholder(node.supBookImage.mediaImage.url))

  return (
    <Image
      className="mb-16"
      src={node.supBookImage?.mediaImage.url || "/default-book-image.jpg"}
      alt={node.supBookImage?.mediaImage.alt || `'${node.title}' Book Cover`}
      height={node.supBookImage?.mediaImage.height || 600}
      width={node.supBookImage?.mediaImage.width || 400}
      sizes="400px"
      loading="eager"
      {...placeholderImage}
    />
  )
}
export default BookPageImage
