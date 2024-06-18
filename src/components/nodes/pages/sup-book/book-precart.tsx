"use client"

import useIsInternational from "@lib/hooks/useIsInternational"
import Button from "@components/elements/button"
import {FormEvent, useState} from "react"
import {ArrowRightIcon} from "@heroicons/react/16/solid"
import {Maybe} from "@lib/gql/__generated__/drupal"
import {BookmarkIcon, BookOpenIcon} from "@heroicons/react/24/outline"
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
  usDigitalPrice?: Maybe<number>
  clothIsbn?: Maybe<string>
  paperIsbn?: Maybe<string>
  digitalIsbn?: Maybe<string>
  hasIntlCart?: boolean
}

const BookPreCart = ({bookTitle, usClothPrice, usClothSalePrice, usClothSaleDiscount, usPaperPrice, usPaperSalePrice, usPaperSaleDiscount, clothIsbn, paperIsbn, digitalIsbn, hasIntlCart = true}: Props) => {
  const router = useRouter()
  const defaultChoice = usClothPrice ? "cloth" : usPaperPrice ? "paper" : "digital"
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

      case "digital":
        isbn = digitalIsbn
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
    <form
      className="@container"
      onSubmit={onFormSubmit}
    >
      <fieldset className="rs-mb-1">
        <legend className="sr-only">Format</legend>
        {!isIntl && (
          <UsFormatChoices
            clothPrice={usClothSalePrice || usClothPrice}
            paperPrice={usPaperSalePrice || usPaperPrice}
            onChange={setFormatChoice}
          />
        )}

        {isIntl && (
          <IntlFormatChoices
            clothIsbn={clothIsbn}
            paperIsbn={paperIsbn}
            onChange={setFormatChoice}
          />
        )}
      </fieldset>

      {hasIntlCart && (
        <fieldset>
          <legend className="mb-3 font-semibold">Region</legend>
          <div className="rs-mb-1 flex flex-wrap border-2 border-black-40 p-1">
            <div className="block min-w-fit flex-1 cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="intl"
                value="us"
                checked={!isIntl}
                onChange={() => setIntl(false)}
              />
              <span className="rs-py-0 rs-px-1 block text-center hover:bg-fog-light hover:underline peer-checked:border-2 peer-checked:border-press-sand-dark peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline">US/Canada</span>
            </div>
            <label className="min-w-fit flex-1 cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="intl"
                value="intl"
                checked={isIntl}
                onChange={() => setIntl(true)}
              />
              <span className="rs-py-0 rs-px-1 block text-center hover:bg-fog-light hover:underline peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline">International</span>
            </label>
          </div>
        </fieldset>
      )}

      {isIntl && <p>For customer shipments outside the US and Canada, please use the button below to order from our partner, Combine Academic Publishers.</p>}

      <div>
        <Button
          buttonElem
          type="submit"
          className="flex w-full items-center justify-center gap-2"
        >
          Add to cart
          <ArrowRightIcon width={24} />
        </Button>
      </div>

      {formatChoice === "cloth" && !isIntl && usClothPrice && usClothSalePrice && (
        <div className="rs-mt-1 -text-m1">
          <div>
            List Price: <span className="italic line-through">{formatCurrency(usClothPrice)}</span>
          </div>
          <div>
            Save {formatCurrency(usClothPrice - usClothSalePrice)} ({usClothSaleDiscount}%)
          </div>
        </div>
      )}

      {formatChoice === "paper" && !isIntl && usPaperPrice && usPaperSalePrice && (
        <div className="rs-mt-1">
          <div>
            List Price: <span className="line-through">{formatCurrency(usPaperPrice)}</span>
          </div>
          <div>
            Save {formatCurrency(usPaperPrice - usPaperSalePrice)} ({usPaperSaleDiscount}%)
          </div>
        </div>
      )}
    </form>
  )
}

const UsFormatChoices = ({clothPrice, paperPrice, onChange}: {clothPrice?: Maybe<number>; paperPrice?: Maybe<number>; onChange: (_format: string) => void}) => {
  const defaultChoice = clothPrice ? "cloth" : paperPrice ? "paper" : "digital"
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
                <span className="font-semibold group-hover:underline">Hardcover</span>
                <span className="flex items-center">
                  <span className="mr-2 text-press-sand-dark">US/CAN</span>
                  <span>{formatCurrency(clothPrice)}</span>
                </span>
              </span>
              <BookmarkIcon
                width={24}
                className="text-fog-dark"
              />
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
                <span className="font-semibold group-hover:underline">Paperback</span>
                <span className="flex items-center">
                  <span className="mr-2 text-press-sand-dark">US/CAN</span>
                  <span>{formatCurrency(paperPrice)}</span>
                </span>
              </span>
              <BookOpenIcon
                width={24}
                className="text-fog-dark"
              />
            </span>
          </span>
        </label>
      )}
    </>
  )
}

const IntlFormatChoices = ({clothIsbn, paperIsbn, onChange}: {clothIsbn?: Maybe<string>; paperIsbn?: Maybe<string>; onChange: (_format: string) => void}) => {
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
              <span className="group-hover:underline">Hardcover</span>
              <BookmarkIcon
                width={24}
                className="text-fog-dark"
              />
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
              <span className="group-hover:underline">Paperback</span>
              <BookOpenIcon
                width={24}
                className="text-fog-dark"
              />
            </span>
          </span>
        </label>
      )}
    </>
  )
}

export default BookPreCart
