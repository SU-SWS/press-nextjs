"use client"

import useIsInternational from "@lib/hooks/useIsInternational"
import Button from "@components/elements/button"
import {FormEvent, useState} from "react"
import {ArrowRightIcon} from "@heroicons/react/16/solid"
import {Maybe} from "@lib/gql/__generated__/drupal"
import {BookmarkIcon} from "@heroicons/react/24/outline"
import {BookOpenIcon} from "@heroicons/react/24/solid"
import {useRouter} from "next/navigation"
import {formatCurrency} from "@lib/utils/format-currency"

type Props = {
  bookTitle: string
  usClothPrice?: Maybe<number>
  usClothSalePrice?: Maybe<number>
  usClothSaleDiscount?: Maybe<number>
  usPaperPrice?: Maybe<number>
  usPaperSalePrice?: Maybe<number>
  usPaperSaleDiscount?: Maybe<number>
  clothIsbn?: Maybe<string>
  paperIsbn?: Maybe<string>
  hasIntlCart?: boolean
  preorder?: Maybe<boolean>
  noCartButton?: Maybe<boolean>
}

const BookPreCart = ({
  bookTitle,
  usClothPrice,
  usClothSalePrice,
  usClothSaleDiscount,
  usPaperPrice,
  usPaperSalePrice,
  usPaperSaleDiscount,
  clothIsbn,
  paperIsbn,
  preorder,
  noCartButton,
  hasIntlCart = true,
}: Props) => {
  const router = useRouter()
  const defaultChoice = usClothPrice ? "cloth" : "paper"
  const [formatChoice, setFormatChoice] = useState(defaultChoice)

  const [isIntl, setIntl] = useIsInternational()

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let isbn: Maybe<string> | undefined = ""
    switch (formatChoice) {
      case "cloth":
        isbn = clothIsbn
        break

      case "paper":
        isbn = paperIsbn
        break
    }

    if (isIntl) {
      const title = bookTitle.replace(/[^a-zA-Z\d\s:]/, "").replace(/ /, "-")
      router.push(`https://www.combinedacademic.co.uk/${isbn}/${title}`)
      return
    }
    router.push(`https://add-to-cart-2.supadu.com/add-to-cart?isbn=${isbn}&client=indiepubs-stanford-university-press`)
  }

  return (
    <form className="@container" onSubmit={onFormSubmit}>
      <fieldset className="rs-mb-1">
        <legend className="sr-only">Format</legend>
        {!isIntl && (
          <UsFormatChoices
            clothPrice={clothIsbn ? usClothSalePrice || usClothPrice : undefined}
            paperPrice={paperIsbn ? usPaperSalePrice || usPaperPrice : undefined}
            onChange={setFormatChoice}
          />
        )}

        {isIntl && <IntlFormatChoices clothIsbn={clothIsbn} paperIsbn={paperIsbn} onChange={setFormatChoice} />}
      </fieldset>

      {hasIntlCart && (
        <fieldset>
          <legend className="mb-3 text-18 font-semibold">Region</legend>
          <div className="rs-mb-neg1 flex flex-wrap border-2 border-black-40 p-1">
            <label className="block min-w-fit flex-1 cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="intl"
                value="us"
                checked={!isIntl}
                onChange={() => setIntl(false)}
              />
              <span className="rs-py-0 rs-px-1 block text-center hover:bg-fog-light hover:underline peer-checked:border-0 peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline md:text-[0.8em]">
                US/Canada
              </span>
            </label>
            <label className="min-w-fit flex-1 cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="intl"
                value="intl"
                checked={isIntl}
                onChange={() => setIntl(true)}
              />
              <span className="rs-py-0 rs-px-1 block text-center hover:bg-fog-light hover:underline peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline md:text-[0.8em]">
                International
              </span>
            </label>
          </div>
        </fieldset>
      )}

      {isIntl && !noCartButton && (
        <p className="text-[0.8em]">
          For customer shipments outside the US and Canada, please use the button below to order from our partner,
          Combined Academic Publishers.
        </p>
      )}

      {!noCartButton && (
        <Button
          buttonElem
          type="submit"
          className="mt-5 flex w-full items-center justify-center gap-2 text-white md:text-[0.85em]"
        >
          {preorder && !isIntl && "Preorder"}
          {!preorder && !isIntl && "Add to cart"}
          {preorder && isIntl && "Preorder from CAP"}
          {!preorder && isIntl && "Purchase from CAP"}
          <ArrowRightIcon width={24} />
        </Button>
      )}

      {formatChoice === "cloth" && !isIntl && usClothPrice && usClothSalePrice && (
        <div className="rs-mt-1 text-18">
          <div>
            List Price: <del className="italic">{formatCurrency(usClothPrice)}</del>
          </div>
          <div>
            Save&nbsp;
            <ins className="no-underline">
              {formatCurrency(usClothPrice - usClothSalePrice)} ({usClothSaleDiscount}%)
            </ins>
          </div>
        </div>
      )}

      {formatChoice === "paper" && !isIntl && usPaperPrice && usPaperSalePrice && (
        <div className="rs-mt-1 text-18">
          <div>
            List Price: <del className="italic">{formatCurrency(usPaperPrice)}</del>
          </div>
          <div>
            Save{" "}
            <ins className="no-underline">
              {formatCurrency(usPaperPrice - usPaperSalePrice)} ({usPaperSaleDiscount}%)
            </ins>
          </div>
        </div>
      )}
    </form>
  )
}

const UsFormatChoices = ({
  clothPrice,
  paperPrice,
  onChange,
}: {
  clothPrice?: Maybe<number>
  paperPrice?: Maybe<number>
  onChange: (_format: string) => void
}) => {
  const defaultChoice = clothPrice ? "cloth" : "paper"
  return (
    <>
      {clothPrice && (
        <label className="mb-3 block cursor-pointer">
          <input
            className="peer sr-only"
            type="radio"
            name="format"
            value="cloth"
            defaultChecked={defaultChoice === "cloth"}
            onChange={() => onChange("cloth")}
          />
          <span className="group rs-py-0 rs-px-1 flex items-center border-4 hover:bg-fog-light peer-checked:border-digital-red peer-focus-visible:bg-fog-light peer-focus-visible:underline">
            <span className="flex w-full items-center gap-2">
              <span className="flex w-full flex-col justify-between gap-2 @lg:flex-row @lg:gap-0">
                <span className="font-semibold group-hover:underline md:text-[0.85em]">Hardcover</span>
                <span className="flex items-center">
                  <span className="mr-2 text-press-sand-dark md:text-[0.85em]">US/CAN</span>
                  <span className="text-press-sand-dark md:text-[0.85em]">{formatCurrency(clothPrice)}</span>
                </span>
              </span>
              <BookOpenIcon width={24} className="text-fog-dark" />
            </span>
          </span>
        </label>
      )}
      {paperPrice && (
        <label className="mb-3 block cursor-pointer">
          <input
            className="peer sr-only"
            type="radio"
            name="format"
            value="paper"
            defaultChecked={defaultChoice === "paper"}
            onChange={() => onChange("paper")}
          />
          <span className="group rs-py-0 rs-px-1 flex items-center border-4 hover:bg-fog-light peer-checked:border-digital-red peer-focus-visible:bg-fog-light peer-focus-visible:underline">
            <span className="flex w-full items-center gap-2">
              <span className="flex w-full flex-col justify-between gap-2 @lg:flex-row @lg:gap-0">
                <span className="font-semibold group-hover:underline md:text-[0.85em]">Paperback</span>
                <span className="flex items-center">
                  <span className="mr-2 text-press-sand-dark md:text-[0.85em]">US/CAN</span>
                  <span className="text-press-sand-dark md:text-[0.85em]">{formatCurrency(paperPrice)}</span>
                </span>
              </span>
              <BookOpenIcon width={24} className="text-fog-dark" />
            </span>
          </span>
        </label>
      )}
    </>
  )
}

const IntlFormatChoices = ({
  clothIsbn,
  paperIsbn,
  onChange,
}: {
  clothIsbn?: Maybe<string>
  paperIsbn?: Maybe<string>
  onChange: (_format: string) => void
}) => {
  const defaultChoice = clothIsbn ? "cloth" : "paper"
  return (
    <>
      {clothIsbn && (
        <label className="mb-3 block cursor-pointer">
          <input
            className="peer sr-only"
            type="radio"
            name="format"
            value="cloth"
            defaultChecked={defaultChoice === "cloth"}
            onChange={() => onChange("cloth")}
          />
          <span className="group rs-py-0 rs-px-1 flex items-center border-4 hover:bg-fog-light peer-checked:border-digital-red peer-focus-visible:bg-fog-light peer-focus-visible:underline">
            <span className="flex w-full items-center justify-between font-semibold">
              <span className="group-hover:underline md:text-[0.85em]">Hardcover</span>
              <BookmarkIcon width={24} className="text-fog-dark" />
            </span>
          </span>
        </label>
      )}
      {paperIsbn && (
        <label className="block cursor-pointer">
          <input
            className="peer sr-only"
            type="radio"
            name="format"
            value="paper"
            defaultChecked={defaultChoice === "paper"}
            onChange={() => onChange("paper")}
          />
          <span className="group rs-py-0 rs-px-1 flex items-center border-4 hover:bg-fog-light peer-checked:border-digital-red peer-focus-visible:bg-fog-light peer-focus-visible:underline">
            <span className="flex w-full items-center justify-between font-semibold">
              <span className="group-hover:underline md:text-[0.85em]">Paperback</span>
              <BookOpenIcon width={24} className="text-fog-dark" />
            </span>
          </span>
        </label>
      )}
    </>
  )
}

export default BookPreCart
