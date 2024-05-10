import {HtmlHTMLAttributes} from "react";
import {ParagraphSupFileList} from "@lib/gql/__generated__/drupal.d";
import FileListSelection from "@components/paragraphs/sup-file-list/file-list-selection";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupFileList
}

const FileListParagraph = ({paragraph, ...props}: Props) => {
  const fileOptions = paragraph.supFileListFiles.map(media => ({
    value: media.id,
    label: media.name,
    url: media.mediaFile.url
  }))
  return (
    <FileListSelection fileOptions={fileOptions} label={paragraph.supFileListLabel} {...props}/>
  )
}
export default FileListParagraph