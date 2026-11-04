import {NodeSupBook} from "@lib/gql/__generated__/graphql"
import BlurImage from "@components/images/blur-image"
import {getImageStyle} from "@lib/utils/image-style"

type Props = {
  node: NodeSupBook
}
const BookPageImage = ({node}: Props) => {
  const mediaImage = node.supBookImage?.mediaImage
  const pageImage = getImageStyle(mediaImage, "pageStyle")
  const imageUrl = pageImage?.url || mediaImage?.url

  return (
    <BlurImage
      className="mb-40"
      src={imageUrl || "/default-book-image.jpg"}
      blurSrc={mediaImage?.variations?.[0]?.url}
      alt={mediaImage?.alt || `'${node.title.replace(/<[^>]*>/g, "")}' Book Cover`}
      height={pageImage?.height || mediaImage?.height || 600}
      width={pageImage?.width || mediaImage?.width || 400}
      sizes="400px"
      loading="eager"
      unoptimized={!!pageImage}
    />
  )
}
export default BookPageImage
