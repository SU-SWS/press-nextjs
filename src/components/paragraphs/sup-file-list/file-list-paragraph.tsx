import {HtmlHTMLAttributes} from "react";
import {ParagraphSupFileList} from "@lib/gql/__generated__/drupal.d";
import FileListSelection from "@components/paragraphs/sup-file-list/file-list-selection";
import {H2} from "@components/elements/headers";
import {DocumentIcon} from "@heroicons/react/24/outline";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupFileList
}

const FileListParagraph = ({paragraph, ...props}: Props) => {
  const fileOptions = paragraph.supFileListFiles.map(media => ({
    value: media.id,
    label: media.name,
    url: media.mediaFile.url
  }))
  if (paragraph.supFileListDisplay === "select") {
    return (
      <FileListSelection fileOptions={fileOptions} label={paragraph.supFileListLabel} {...props}/>
    )
  }

  return (
    <div {...props}>
      <H2>{paragraph.supFileListLabel}</H2>
      <ul className="list-unstyled">
        {paragraph.supFileListFiles.map(media =>
          <li key={media.id}>
            <a href={media.mediaFile.url} className="flex gap-10 items-center text-m1 text-press-sand-dark w-fit">
              <DocumentIcon width={50}/>
              {media.name}
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}
export default FileListParagraph