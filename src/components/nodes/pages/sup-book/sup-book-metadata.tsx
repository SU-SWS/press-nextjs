import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import {getCleanDescription, getFirstText} from "@lib/utils/text-tools"

type Props = {
  node: NodeSupBook
  isExcerptPage?: true
  isCopyRequestPage?: true
}
const SupBookMetadata = async ({node, isExcerptPage, isCopyRequestPage}: Props) => {
  const siteName = "Stanford University Press"

  const image = node.supBookImage?.mediaImage

  let description = getCleanDescription(node.supBookDescription?.processed)

  let title = node.title
  if (isExcerptPage) {
    title += ": Excerpt & More"
    description = getFirstText(node.supBookExcerpts)
  }
  if (isCopyRequestPage) {
    title += ": Copy Requests"
    description = `Instructions to get copy requests of the book "${node.title}"`
  }

  const pageTitle = `${title} | ${siteName}`

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="book" />
      <meta
        property="book:isbn"
        content={
          node.supBookIsbn13Isw ||
          node.supBookIsbn13Paper ||
          node.supBookIsbn13Cloth ||
          node.supBookIsbn13Alt ||
          undefined
        }
      />
      <meta property="book:release_date" content={node.supBookPubYearFirst || undefined} />

      {node.supBookAuthors?.map(author => (
        <>
          <meta property="book:author:profile:first_name" content={author.given || undefined} />
          <meta property="book:author:profile:last_name" content={author.family || undefined} />
        </>
      ))}

      {image && (
        <>
          <meta property="og:image" content={image.url} />
          <meta property="og:image:width" content={image.width.toString()} />
          <meta property="og:image:height" content={image.height.toString()} />
          {image.alt && <meta property="og:image:alt" content={image.alt} />}

          <meta name="twitter:image" content={image.url} />
          <meta name="twitter:image:width" content={image.width.toString()} />
          <meta name="twitter:image:height" content={image.height.toString()} />
          {image.alt && <meta name="twitter:image:alt" content={image.alt} />}
        </>
      )}

      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
    </>
  )
}

export default SupBookMetadata
