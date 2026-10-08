"use client"

import {HtmlHTMLAttributes, useId, useState} from "react"
import {DocumentArrowDownIcon} from "@heroicons/react/24/outline"
import Button from "@components/elements/button"
import cn from "@lib/utils/className"
import SelectList, {SelectOption} from "@components/elements/inputs/select-list"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  fileOptions: (SelectOption & {url: string})[]
  label: string
}

const FileListSelection = ({fileOptions, label, ...props}: Props) => {
  const id = useId()
  const [chosenFile, setChosenFile] = useState<string | null>(null)

  const chosenItem = fileOptions.find(option => option.value === chosenFile)
  return (
    <div {...props} className={cn("centered max-w-800", props.className)}>
      <div className="rs-mb-1 max-w-4xl">
        <div id={id} className="mb-7.5 type-0 font-medium xl:text-21">
          {label}
        </div>
        <SelectList<false>
          items={fileOptions}
          ariaLabelledby={id}
          emptyLabel="Choose"
          onValueChange={v => setChosenFile(v as string)}
        />
      </div>
      {chosenItem && (
        <Button
          href={chosenItem.url}
          className="flex items-center gap-25 py-[1.2rem] pr-[1.8rem] pl-[2.1rem] type-0 xl:text-21"
          prefetch={false}
        >
          Download {chosenItem.label} <DocumentArrowDownIcon width={28} />
        </Button>
      )}
    </div>
  )
}
export default FileListSelection
