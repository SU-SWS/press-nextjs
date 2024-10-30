import {NodeSupBookAncillary} from "@lib/gql/__generated__/drupal.d"
import {getCleanDescription, getFirstText} from "@lib/utils/text-tools"

type Props = {
  node: NodeSupBookAncillary
}
const SupAncillaryMetadata = async ({node}: Props) => {
  const siteName = "Stanford University Press"
  const image = node.supAncillaryBook.supBookImage?.mediaImage

  const description = getCleanDescription(node.body?.processed) || getFirstText(node.supAncillaryParagraphs)
  const pageTitle = `${node.supAncillaryBook.title}: ${node.title} | ${siteName}`

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

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

export default SupAncillaryMetadata
