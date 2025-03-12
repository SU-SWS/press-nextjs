"use client"

import useIsInternational from "@lib/hooks/useIsInternational"
import Button from "@components/elements/button"
import {HTMLAttributes, useEffect, useState} from "react"
import {ArrowRightIcon} from "@heroicons/react/16/solid"
import {Maybe, NodeSupBook, PressPrice} from "@lib/gql/__generated__/drupal.d"
import {BookOpenIcon as BookOpenIconOutline, DeviceTabletIcon} from "@heroicons/react/24/outline"
import {BookOpenIcon} from "@heroicons/react/24/solid"
import {formatCurrency} from "@lib/utils/format-currency"
import {twMerge} from "tailwind-merge"
import {clsx} from "clsx"
import {submitForm} from "@components/nodes/pages/sup-book/precart/precart.server"
import {useBoolean} from "usehooks-ts"
import {ChangeEvent} from "react"
import Link from "@components/elements/link"

type PriceProps = PressPrice & {}

type Props = {
  priceId?: PressPrice["id"]
  clothIsbn?: NodeSupBook["supBookIsbn13Cloth"]
  paperIsbn?: NodeSupBook["supBookIsbn13Paper"]
  ebookIsbn?: NodeSupBook["supBookIsbn13Digital"]
  epub?: NodeSupBook["supBookEpubFormat"]
  pdf?: NodeSupBook["supBookPdfFormat"]
  bookTitle: NodeSupBook["title"]
  hasIntlCart?: PressPrice["supIntlCart"]
}

const PreCartClient = ({priceId, clothIsbn, paperIsbn, hasIntlCart, bookTitle, ebookIsbn, epub, pdf}: Props) => {
  const [priceData, setPriceData] = useState<PriceProps>()
  const {value: ebookSelected, setValue: setEbookSelected} = useBoolean(false)

  useEffect(() => {
    if (priceId) {
      fetch(`/api/books/price/${priceId}`)
        .then(res => res.json())
        .then((data: PressPrice) => setPriceData(data))
        .catch(_e => console.warn(`Something went wrong fetching ${priceId}`))
    }
  }, [priceId])

  const [isIntl, setIntl] = useIsInternational()

  const onFormatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEbookSelected(e.target.value.includes("ebook:"))
  }

  return (
    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
    <form className="rs-mb-1 rs-pb-1 border-b-2 border-fog @container" action={submitForm}>
      <input type="hidden" name="title" value={bookTitle} />
      <label className="sr-only">
        Do not fill with any information
        <input name="email" type="email" />
      </label>

      <fieldset className="rs-mb-1 space-y-4">
        <legend className="sr-only">Format</legend>
        {!isIntl && (
          <UsFormatChoices
            clothIsbn={clothIsbn}
            paperIsbn={paperIsbn}
            ebookIsbn={ebookIsbn}
            clothPrice={clothIsbn ? priceData?.supClothSale || priceData?.supClothPrice || false : undefined}
            paperPrice={paperIsbn ? priceData?.supPaperSale || priceData?.supPaperPrice || false : undefined}
            ebookPrice={ebookIsbn && (epub || pdf) ? priceData?.supDigitalPrice || false : undefined}
            onChange={onFormatChange}
          />
        )}

        {isIntl && <IntlFormatChoices clothIsbn={clothIsbn} paperIsbn={paperIsbn} />}
      </fieldset>

      {ebookSelected && !isIntl && (
        <div>
          <fieldset>
            <legend className="mb-3 text-18 font-semibold">Select Ebook Format</legend>
            <div className="rs-mb-neg1 flex flex-wrap border-2 border-black-40 p-1">
              {epub && (
                <label className="block min-w-fit flex-1 cursor-pointer">
                  <input className="peer sr-only" type="radio" name="ebook" value="EPUB" defaultChecked />
                  <span className="rs-py-0 rs-px-1 block text-center hover:bg-fog-light hover:underline peer-checked:border-0 peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline md:text-[0.8em]">
                    EPUB
                  </span>
                </label>
              )}
              {pdf && (
                <label className="min-w-fit flex-1 cursor-pointer">
                  <input className="peer sr-only" type="radio" name="ebook" value="PDF" defaultChecked={!epub} />
                  <span className="rs-py-0 rs-px-1 block text-center hover:bg-fog-light hover:underline peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline md:text-[0.8em]">
                    PDF
                  </span>
                </label>
              )}
            </div>
          </fieldset>

          <div className="text-center text-xl">
            Read via the{" "}
            <Link href="http://sup.org/ebooks" className="font-normal text-black">
              Academic Reader App
            </Link>
            .
          </div>
        </div>
      )}

      {!ebookSelected && (hasIntlCart || priceData?.supIntlCart) && (
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

      {isIntl && !priceData?.supComingSoon && (
        <p className="text-[0.8em]">
          For customer shipments outside the US and Canada, please use the button below to order from our partner,
          Combined Academic Publishers.
        </p>
      )}

      <Button
        buttonElem
        type="submit"
        className={twMerge(
          "group mt-5 flex w-full items-center justify-center gap-2 text-white md:text-[0.85em]",
          clsx({
            "border-0 bg-black-70 hocus:bg-black-80": priceData?.supComingSoon,
          })
        )}
        disabled={!!priceData?.supComingSoon}
      >
        {!priceData?.supComingSoon && priceData?.supPreorder && !isIntl && "Preorder"}
        {!priceData?.supComingSoon && !priceData?.supPreorder && !isIntl && "Add to cart"}
        {!priceData?.supComingSoon && priceData?.supPreorder && isIntl && "Preorder from CAP"}
        {!priceData?.supComingSoon && !priceData?.supPreorder && isIntl && "Purchase from CAP"}
        {priceData?.supComingSoon && "Coming Soon"}

        {!priceData?.supComingSoon && (
          <ArrowRightIcon width={24} className="transition-all group-hocus:translate-x-2" />
        )}
      </Button>

      {!isIntl && priceData?.supClothPrice && priceData?.supClothSale && (
        <div className="rs-mt-1 text-18">
          <div>
            Hardcover List Price: <del className="italic">{formatCurrency(priceData?.supClothPrice)}</del>
          </div>
          <div>
            Save&nbsp;
            <ins className="no-underline">
              {formatCurrency(priceData?.supClothPrice - priceData?.supClothSale)} ({priceData?.supClothDiscount}%)
            </ins>
          </div>
        </div>
      )}

      {!isIntl && priceData?.supPaperPrice && priceData?.supPaperSale && (
        <div className="rs-mt-1 text-18">
          <div>
            Paperback List Price: <del className="italic">{formatCurrency(priceData?.supPaperPrice)}</del>
          </div>
          <div>
            Save{" "}
            <ins className="no-underline">
              {formatCurrency(priceData?.supPaperPrice - priceData?.supPaperSale)} ({priceData?.supPaperDiscount}%)
            </ins>
          </div>
        </div>
      )}
    </form>
  )
}

const UsFormatChoices = ({
  clothIsbn,
  clothPrice,
  paperIsbn,
  ebookIsbn,
  ebookPrice,
  paperPrice,
  onChange,
}: {
  clothIsbn?: NodeSupBook["supBookIsbn13Cloth"]
  paperIsbn?: NodeSupBook["supBookIsbn13Paper"]
  ebookIsbn?: NodeSupBook["supBookIsbn13Digital"]
  clothPrice?: Maybe<number | false>
  ebookPrice?: Maybe<number | false>
  paperPrice?: Maybe<number | false>
  onChange?: (_e: ChangeEvent<HTMLInputElement>) => void
}) => {
  const defaultChoice = clothIsbn ? "cloth" : "paper"

  return (
    <>
      {clothIsbn && clothPrice !== undefined && (
        <FormatChoice
          typeName="cloth"
          isbn={clothIsbn}
          defaultChecked={defaultChoice === "cloth"}
          onInputChange={onChange}
        >
          <span className="flex w-full flex-col items-center justify-between gap-5 @lg:flex-row @lg:gap-0">
            <span className="font-semibold group-hover:underline md:text-[0.85em]">Hardcover</span>
            <span className="mr-2 text-press-sand-dark @lg:ml-2 @lg:text-center md:text-[0.85em]">US/CAN</span>
            {clothPrice && <span className="text-press-sand-dark md:text-[0.85em]">{formatCurrency(clothPrice)}</span>}
          </span>
          <BookOpenIcon width={24} className="text-fog-dark" />
        </FormatChoice>
      )}
      {paperIsbn && paperPrice !== undefined && (
        <FormatChoice
          typeName="paper"
          isbn={paperIsbn}
          defaultChecked={defaultChoice === "paper"}
          onInputChange={onChange}
        >
          <span className="flex w-full flex-col items-center justify-between gap-2 @lg:flex-row @lg:gap-0">
            <span className="font-semibold group-hover:underline md:text-[0.85em]">Paperback</span>

            <span className="mr-2 text-press-sand-dark @lg:ml-2 @lg:text-center md:text-[0.85em]">US/CAN</span>
            {paperPrice && <span className="text-press-sand-dark md:text-[0.85em]">{formatCurrency(paperPrice)}</span>}
          </span>
          <BookOpenIconOutline width={24} className="text-fog-dark" />
        </FormatChoice>
      )}
      {ebookIsbn && ebookPrice !== undefined && (
        <FormatChoice typeName="ebook" isbn={ebookIsbn} onInputChange={onChange}>
          <span className="flex w-full flex-col items-center justify-between gap-2 @lg:flex-row @lg:gap-0">
            <span className="font-semibold group-hover:underline md:text-[0.85em]">EBook</span>

            {ebookPrice && <span className="text-press-sand-dark md:text-[0.85em]">{formatCurrency(ebookPrice)}</span>}
          </span>
          <DeviceTabletIcon width={24} className="text-fog-dark" />
        </FormatChoice>
      )}
    </>
  )
}

const IntlFormatChoices = ({
  clothIsbn,
  paperIsbn,
}: {
  clothIsbn?: NodeSupBook["supBookIsbn13Cloth"]
  paperIsbn?: NodeSupBook["supBookIsbn13Paper"]
}) => {
  const defaultChoice = clothIsbn ? "cloth" : "paper"
  return (
    <>
      {clothIsbn && (
        <FormatChoice typeName="cloth" isbn={clothIsbn} defaultChecked={defaultChoice === "cloth"}>
          <span className="font-semibold group-hover:underline md:text-[0.85em]">Hardcover</span>
          <BookOpenIcon width={24} className="text-fog-dark" />
        </FormatChoice>
      )}
      {paperIsbn && (
        <FormatChoice typeName="paper" isbn={paperIsbn} defaultChecked={defaultChoice === "paper"}>
          <span className="font-semibold group-hover:underline md:text-[0.85em]">Paperback</span>
          <BookOpenIconOutline width={24} className="text-fog-dark" />
        </FormatChoice>
      )}
    </>
  )
}

const FormatChoice = ({
  typeName,
  isbn,
  defaultChecked,
  onInputChange,
  children,
  ...props
}: {
  typeName: string
  isbn: string
  defaultChecked?: boolean
  onInputChange?: (_e: ChangeEvent<HTMLInputElement>) => void
} & HTMLAttributes<HTMLLabelElement>) => {
  return (
    <label {...props} className={twMerge("block cursor-pointer", props.className)}>
      <input
        className="peer sr-only"
        type="radio"
        name="format"
        value={`${typeName}:${isbn}`}
        defaultChecked={defaultChecked}
        onChange={onInputChange}
      />
      <span className="group rs-py-0 rs-px-1 flex items-center border-4 hover:bg-fog-light peer-checked:border-digital-red peer-focus-visible:bg-fog-light peer-focus-visible:underline">
        <span className="flex w-full items-center justify-between">{children}</span>
      </span>
    </label>
  )
}

export default PreCartClient
