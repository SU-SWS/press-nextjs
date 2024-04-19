"use client";

import {HtmlHTMLAttributes, useState} from "react";
import {ParagraphSupFileList} from "@lib/gql/__generated__/drupal.d";
import SelectList from "@components/elements/select-list";
import Link from "@components/elements/link";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupFileList
}

const FileListParagraph = ({paragraph, ...props}: Props) => {
  const [chosenFile, setChosenFile] = useState<string|null>(null)
  const fileOptions = paragraph.supFileListFiles.map(media => ({value: media.id, label: media.name}))

  const chosenItem = paragraph.supFileListFiles.find(media => media.id === chosenFile);
  return (
    <div {...props}>
      <div className="mb-10">
        <SelectList
          options={fileOptions}
          label="Choose a file"
          onChange={(_e, v) => setChosenFile(v as string)}
        />
      </div>
      {chosenItem &&
        <Link className="button" href={chosenItem.mediaFile.url} download prefetch={false}>Download</Link>
      }
    </div>
  )
}
export default FileListParagraph