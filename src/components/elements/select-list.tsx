"use client"

import {JSX} from "react"
import {useSelect, SelectOptionDefinition, SelectProvider, SelectValue} from "@mui/base/useSelect"
import {useOption} from "@mui/base/useOption"
import {FocusEvent, KeyboardEvent, MouseEvent, ReactNode, RefObject, useEffect, useId, useLayoutEffect, useRef, useState} from "react"
import {CheckIcon, ChevronDownIcon} from "@heroicons/react/20/solid"
import {Maybe} from "@lib/gql/__generated__/drupal.d"
import {twMerge} from "tailwind-merge"
import {clsx} from "clsx"

type OptionProps = {
  rootRef: RefObject<HTMLUListElement>
  children?: ReactNode
  value: string
  disabled?: boolean
}

const renderSelectedValue = (value: SelectValue<string, boolean>, options: SelectOptionDefinition<string>[]) => {
  if (Array.isArray(value)) {
    return value.map(item => (
      <span
        key={item}
        className="mb-2 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded bg-archway p-5 text-white"
      >
        {renderSelectedValue(item, options)}
      </span>
    ))
  }
  const selectedOption = options.find(option => option.value === value)
  return selectedOption ? selectedOption.label : null
}

function CustomOption(props: OptionProps) {
  const {children, value, rootRef, disabled = false} = props
  const {getRootProps, highlighted, selected} = useOption({rootRef: rootRef, value, disabled, label: children})

  const {id, ...otherProps}: {id: string} = getRootProps()

  useEffect(() => {
    if (highlighted && id && rootRef?.current?.parentElement) {
      const item = document.getElementById(id)
      if (item) {
        const itemTop = item?.offsetTop
        const itemHeight = item?.offsetHeight
        const parentScrollTop = rootRef.current.parentElement.scrollTop
        const parentHeight = rootRef.current.parentElement.offsetHeight

        if (itemTop < parentScrollTop) {
          rootRef.current.parentElement.scrollTop = itemTop
        }

        if (itemTop + itemHeight > parentScrollTop + parentHeight) {
          rootRef.current.parentElement.scrollTop = itemTop - parentHeight + itemHeight
        }
      }
    }
  }, [rootRef, id, highlighted])

  return (
    <li
      {...otherProps}
      id={id}
      className={twMerge(
        "rs-mt-0 rs-m-neg1 flex cursor-pointer items-center overflow-hidden rounded-full border-3 border-transparent px-8 py-4 hocus:bg-press-bay-light hocus:text-black hocus:underline",
        clsx({
          "border-press-bay bg-press-bay-light text-black no-underline": selected,
          "border-press-bay bg-press-bay-light text-black underline": !selected && highlighted,
        })
      )}
    >
      {children}
      {selected && (
        <CheckIcon
          width={20}
          className="text-stone-dark"
        />
      )}
    </li>
  )
}

type Props = {
  options: SelectOptionDefinition<string>[]
  label?: Maybe<string>
  ariaLabelledby?: Maybe<string>
  defaultValue?: SelectValue<string, boolean>
  onChange?: (_event: MouseEvent | KeyboardEvent | FocusEvent | null, _value: SelectValue<string, boolean>) => void
  multiple?: boolean
  disabled?: boolean
  value?: SelectValue<string, boolean>
  required?: boolean
  emptyValue?: Maybe<string>
  emptyLabel?: Maybe<string>
  name?: Maybe<string>
  borderless?: boolean
  downIcon?: JSX.Element
  className?: string
}

const SelectList = ({options = [], label, multiple, ariaLabelledby, required, defaultValue, name, emptyValue, emptyLabel = "- None -", borderless = false, downIcon, ...props}: Props) => {
  const labelId = useId()
  const labeledBy = ariaLabelledby || labelId

  const listboxContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const [listboxVisible, setListboxVisible] = useState<boolean>(false)

  const {getButtonProps, getListboxProps, contextValue, value} = useSelect<string, boolean>({
    listboxRef,
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    defaultValue,
    multiple,
    ...props,
  })

  useEffect(() => {
    listboxRef.current?.focus()
    listboxContainerRef.current?.scroll(0, 0)
  }, [listboxVisible])

  useLayoutEffect(() => {
    const parentContainer = listboxContainerRef.current?.getBoundingClientRect()
    if (parentContainer && parentContainer.bottom > window.innerHeight) {
      listboxRef.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    }
  }, [listboxVisible, value])

  const optionChosen = multiple && value ? value.length > 0 : !!value

  return (
    <div className="relative h-[45px]">
      <button
        {...getButtonProps()}
        className={clsx("w-full p-5 text-left", {"rounded border border-black-40": !borderless, "bg-black-30": props.disabled})}
        aria-labelledby={labeledBy}
      >
        {label && (
          <span
            className={clsx("relative block max-w-[calc(100%-30px)]", {
              "top-[-15px] w-full": optionChosen,
            })}
          >
            <span
              id={labelId}
              className={twMerge("block w-fit px-5 text-16", clsx({"bg-black-30": props.disabled}))}
            >
              {label}
            </span>
          </span>
        )}

        {!label && emptyLabel && !optionChosen && (
          <span className={clsx("relative block max-w-[calc(100%-30px)]")}>
            <span
              id={labelId}
              className={twMerge("block w-fit px-5 text-16", clsx({"bg-black-30": props.disabled}))}
            >
              {emptyLabel}
            </span>
          </span>
        )}

        {optionChosen && <span className="block max-w-[calc(100%-30px)] overflow-hidden text-16">{renderSelectedValue(value, options)}</span>}

        <span className="absolute right-5 top-0 flex h-full items-center">{downIcon || <ChevronDownIcon width={20} />}</span>
      </button>

      <div
        ref={listboxContainerRef}
        className={twMerge("absolute left-0 top-full z-[10] max-h-[300px] w-full overflow-y-scroll border border-black-20 bg-white pb-5 shadow-lg", clsx({hidden: !listboxVisible}))}
      >
        <ul
          {...getListboxProps()}
          className={clsx("list-unstyled my-5 *:text-16", {hidden: !listboxVisible})}
          aria-hidden={!listboxVisible}
          aria-labelledby={labeledBy}
        >
          <SelectProvider value={contextValue}>
            {!required && !multiple && (
              <CustomOption
                value={emptyValue || ""}
                rootRef={listboxRef}
              >
                {emptyLabel}
              </CustomOption>
            )}

            {options.map(option => {
              return (
                <CustomOption
                  key={option.value}
                  value={option.value}
                  rootRef={listboxRef}
                >
                  {option.label}
                </CustomOption>
              )
            })}
          </SelectProvider>
        </ul>
      </div>
      {name && (
        <input
          ref={inputRef}
          name={name}
          type="hidden"
          value={value || ""}
        />
      )}
    </div>
  )
}

export default SelectList
