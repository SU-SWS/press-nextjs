"use client"

import {HtmlHTMLAttributes, useId, useState} from "react"

import SelectList from "@components/elements/select-list"
import {SelectOptionDefinition} from "@mui/base/useSelect"
import {DocumentArrowDownIcon} from "@heroicons/react/24/outline"
import Button from "@components/elements/button"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  fileOptions: (SelectOptionDefinition<string> & {url: string})[]
  label: string
}

const FileListSelection = ({fileOptions, label, ...props}: Props) => {
  const id = useId()
  const [chosenFile, setChosenFile] = useState<string | null>(null)

  const chosenItem = fileOptions.find(option => option.value === chosenFile)
  return (
    <div className={twMerge("centered max-w-800", props.className)} {...props}>
      <div className="rs-mb-1 max-w-4xl">
        <div id={id} className="type-0 mb-3 font-medium">
          {label}
        </div>
        <SelectList
          options={fileOptions}
          ariaLabelledby={id}
          emptyLabel="Choose"
          onChange={(_e, v) => setChosenFile(v as string)}
        />
      </div>
      {chosenItem && (
        <Button
          href={chosenItem.url}
          prefetch={false}
          className="type-0 flex items-center gap-10 py-[1.2rem] pl-[2.1rem] pr-[1.8rem]"
        >
          Download {chosenItem.label} <DocumentArrowDownIcon width={28} />
        </Button>
      )}
    </div>
  )
}
export default FileListSelection
