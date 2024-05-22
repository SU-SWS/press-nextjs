import {HtmlHTMLAttributes} from "react";
import {ParagraphSupFileList} from "@lib/gql/__generated__/drupal.d";
import FileListSelection from "@components/paragraphs/sup-file-list/file-list-selection";
import Image from "next/image";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupFileList
}

const FileListParagraph = ({paragraph, ...props}: Props) => {
  const fileOptions = paragraph.supFileListFiles.map(media => ({
    value: media.id,
    label: media.name,
    url: media.mediaFile.url
  }))
  if (paragraph.supFileListDisplay==="select") {
    return (
      <FileListSelection fileOptions={fileOptions} label={paragraph.supFileListLabel} {...props}/>
    )
  }

  return (
    <ul className="list-unstyled">
      {paragraph.supFileListFiles.map(media =>
      <li key={media.id}>
        <a href={media.mediaFile.url} className="flex gap-5 items-center">
          <Image
            src={media.mediaFile.url.match(/\.pdf/) ? "/pdf.png" : "/document.png"}
            alt=""
            width={30}
            height={30}
          />
          {media.name}
        </a>
      </li>
      )}
    </ul>
  )
}
export default FileListParagraph