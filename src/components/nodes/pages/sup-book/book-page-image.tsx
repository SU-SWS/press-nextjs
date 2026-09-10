import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import BlurImage from "@components/images/blur-image"

type Props = {
  node: NodeSupBook
}
const BookPageImage = ({node}: Props) => {
  return (
    <BlurImage
      className="mb-16"
      src={node.supBookImage?.mediaImage.url || "/default-book-image.jpg"}
      alt={node.supBookImage?.mediaImage.alt || `'${node.title.replace(/<[^>]*>/g, "")}' Book Cover`}
      height={node.supBookImage?.mediaImage.height || 600}
      width={node.supBookImage?.mediaImage.width || 400}
      sizes="400px"
      loading="eager"
    />
  )
}
export default BookPageImage
