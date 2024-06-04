import {HtmlHTMLAttributes} from "react"
import {ParagraphSupFileList} from "@lib/gql/__generated__/drupal.d"
import FileListSelection from "@components/paragraphs/sup-file-list/file-list-selection"
import {H2} from "@components/elements/headers"
import {DocumentIcon} from "@heroicons/react/24/outline"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupFileList
}

const FileListParagraph = ({paragraph, ...props}: Props) => {
  const fileOptions = paragraph.supFileListFiles.map(media => ({
    value: media.id,
    label: media.name,
    url: media.__typename === "MediaFile" ? media.mediaFile.url : media.__typename === "MediaSupProtectedFile" ? media.supMediaFile.url.replace(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string, "") : "",
  }))

  if (paragraph.supFileListDisplay === "select") {
    return (
      <FileListSelection
        fileOptions={fileOptions}
        label={paragraph.supFileListLabel}
        {...props}
      />
    )
  }

  return (
    <div {...props}>
      <H2>{paragraph.supFileListLabel}</H2>
      <ul className="list-unstyled">
        {fileOptions.map(media => (
          <li key={media.value}>
            <a
              href={media.url}
              className="flex w-fit items-center gap-10 text-m1 text-press-sand-dark"
            >
              <DocumentIcon width={50} />
              {media.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default FileListParagraph
