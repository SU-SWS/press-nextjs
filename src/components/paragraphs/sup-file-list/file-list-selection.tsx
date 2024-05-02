"use client";

import {HtmlHTMLAttributes, useState} from "react";

import SelectList from "@components/elements/select-list";
import Link from "@components/elements/link";
import {SelectOptionDefinition} from "@mui/base/useSelect";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  fileOptions: (SelectOptionDefinition<string> & {url: string})[]
}

const FileListSelection = ({fileOptions, ...props}: Props) => {
  const [chosenFile, setChosenFile] = useState<string|null>(null)

  const chosenItem = fileOptions.find(option => option.value === chosenFile);
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
        <Link className="button" href={chosenItem.url} download prefetch={false}>
          Download&nbsp;<span className="sr-only">{chosenItem.label}</span>
        </Link>
      }
    </div>
  )
}
export default FileListSelection;