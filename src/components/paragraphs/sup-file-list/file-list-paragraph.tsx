import {HtmlHTMLAttributes} from "react"
import {ParagraphSupFileList} from "@lib/gql/__generated__/drupal.d"
import FileListSelection from "@components/paragraphs/sup-file-list/file-list-selection"
import {H2} from "@components/elements/headers"
import {DocumentTextIcon} from "@heroicons/react/24/outline"
import {LockClosedIcon} from "@heroicons/react/24/solid"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupFileList
}

const FileListParagraph = ({paragraph, ...props}: Props) => {
  const fileOptions = paragraph.supFileListFiles.map(media => ({
    value: media.uuid,
    label: media.name,
    url:
      media.__typename === "MediaFile"
        ? media.mediaFile.url
        : media.__typename === "MediaSupProtectedFile"
          ? media.supMediaFile.url.replace(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string, "")
          : "",
  }))

  if (paragraph.supFileListDisplay === "select") {
    return (
      <FileListSelection fileOptions={fileOptions} label={paragraph.supFileListLabel || "Choose a file"} {...props} />
    )
  }

  return (
    <div {...props} className={twMerge("centered max-w-800", props.className)}>
      {paragraph.supFileListLabel && <H2>{paragraph.supFileListLabel}</H2>}
      <ul className="list-unstyled">
        {fileOptions.map(media => (
          <li key={media.value} className="rs-mb-2">
            <a
              href={media.url}
              className="group type-0 flex w-fit items-center gap-7 font-normal text-stone-dark xl:text-21"
            >
              <span className="relative block">
                <DocumentTextIcon width={44} className="text-press-sand-light group-hocus:text-archway-dark" />

                {media.url.startsWith("/system/") && (
                  <LockClosedIcon width={26} className="absolute bottom-0 right-0" />
                )}
              </span>
              {media.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default FileListParagraph
