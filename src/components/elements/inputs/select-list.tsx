"use client"

import {Select} from "@base-ui/react/select"
import {ReactNode} from "react"
import {ChevronDownIcon, CheckIcon} from "@heroicons/react/20/solid"
import cn from "@lib/utils/className"
import {SelectRootProps} from "@base-ui/react/select"

export type SelectOption = {
  value: string
  label: string | ReactNode
}

interface Props<Value, Multiple extends boolean | undefined = false> extends Omit<
  SelectRootProps<Value, Multiple>,
  "items"
> {
  items?: SelectOption[]
  label?: string | ReactNode
  emptyValue?: string
  emptyLabel?: string
  className?: string
  ariaLabelledby?: string
  borderless?: boolean
}

const SelectList = <T extends boolean = true>({
  items = [],
  label,
  emptyValue,
  className,
  emptyLabel = "- None -",
  required,
  ariaLabelledby,
  borderless,
  ...props
}: Props<string, T>) => {
  const options = !required && emptyLabel ? [{value: emptyValue || "", label: emptyLabel}, ...items] : [...items]
  return (
    <div className={cn("m-5 w-full max-w-[350px]", className)}>
      <Select.Root items={options} required={required} {...props}>
        {label && <Select.Label className="text-4xl font-semibold">{label}</Select.Label>}
        <Select.Trigger
          aria-labelledby={ariaLabelledby}
          className={cn("flex w-full items-center p-10 text-4xl", {
            "rounded-[0.3rem] border border-black-50 shadow-lg": !borderless,
          })}
        >
          <Select.Value className="text-16" placeholder={emptyLabel} />
          <Select.Icon className="ml-auto">
            <ChevronDownIcon width={20} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner className="z-10" align="start">
            <Select.Popup className="">
              <Select.List className="max-h-[300px] min-w-[200px] overflow-y-auto border border-black-20 bg-white p-12.5 shadow-lg">
                {options.map(item => (
                  <Option key={item.value} {...item} />
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}

const Option = ({value, label}: SelectOption) => {
  return (
    <Select.Item
      value={value}
      className="group mb-7.5 flex cursor-pointer items-center gap-7.5 rounded-full border-3 border-transparent p-5 last:mb-0 aria-selected:border-press-bay aria-selected:bg-press-bay-light hocus:bg-press-bay-light hocus:underline"
    >
      <Select.ItemText className="p-10 text-16">{label}</Select.ItemText>
      <Select.ItemIndicator keepMounted className="flex h-17.5 w-17.5 items-center">
        <CheckIcon width={20} className="mx-auto hidden w-12.5 group-aria-selected:block" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}

export default SelectList
