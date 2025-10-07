"use client"

import useIsInternational from "@lib/hooks/useIsInternational"
import Button from "@components/elements/button"
import {FormEvent, HTMLAttributes, ReactNode, useEffect, useState} from "react"
import {ArrowRightIcon} from "@heroicons/react/16/solid"
import {Maybe, NodeSupBook, PressPrice} from "@lib/gql/__generated__/drupal.d"
import {BookOpenIcon as BookOpenIconOutline, DeviceTabletIcon} from "@heroicons/react/24/outline"
import {BookOpenIcon} from "@heroicons/react/24/solid"
import {formatCurrency} from "@lib/utils/format-currency"
import {twMerge} from "tailwind-merge"
import {clsx} from "clsx"
import {useBoolean} from "usehooks-ts"
import {ChangeEvent} from "react"
import Link from "@components/elements/link"
import {submitForm} from "@components/nodes/pages/sup-book/precart/precart.server"
import {getCartUrl} from "@components/nodes/pages/sup-book/precart/get-cart-url"
import {toast} from "react-toastify"
import useCartCount from "@lib/hooks/useCartCount"
import {AddToCartResponse} from "@lib/@types/cart-api"

type Props = {
  priceId?: PressPrice["id"]
  clothIsbn?: NodeSupBook["supBookIsbn13Cloth"]
  paperIsbn?: NodeSupBook["supBookIsbn13Paper"]
  ebookIsbn?: NodeSupBook["supBookIsbn13Digital"]
  epub?: NodeSupBook["supBookEpubFormat"]
  pdf?: NodeSupBook["supBookPdfFormat"]
  bookTitle: NodeSupBook["title"]
  hasIntlCart?: PressPrice["supIntlCart"]
  firstPub?: NodeSupBook["supBookPubDateFirst"]
  altIsbn?: NodeSupBook["supBookIsbn13Alt"]
  altFormat?: NodeSupBook["supBookAltFormat"]
}

const PreCartClient = ({
  priceId,
  clothIsbn,
  paperIsbn,
  hasIntlCart,
  bookTitle,
  ebookIsbn,
  epub,
  pdf,
  firstPub,
  altIsbn,
  altFormat,
}: Props) => {
  const {setCartCount} = useCartCount()
  const [priceData, setPriceData] = useState<PressPrice>()
  const {value: ebookSelected, setValue: setEbookSelected} = useBoolean(false)
  const {value: shouldShowEbookButton, setTrue: showEbookButton} = useBoolean(false)

  useEffect(() => {
    // Only show the ebook button if the first published date is in the past. Might allow pre-ordering at some time.
    if (!firstPub || new Date(firstPub.time) < new Date()) showEbookButton()
  }, [firstPub, showEbookButton])

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

  // Client side form submission. Fallback to server action form submission.
  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    // Honeypot field.
    if (formData.get("email")) return

    const bookTitle = formData.get("title") as string
    const [format, isbn] = (formData.get("format") as string).split(":")
    const ebookFormat = formData.get("ebook") as string
    const altFormat = formData.get("alt-format") as string

    const cartUrl = getCartUrl(bookTitle, format, isbn, ebookFormat, isIntl, altFormat)
    if (cartUrl.includes("combinedacademic")) {
      window.location.href = cartUrl
      return
    }

    fetch(cartUrl, {credentials: "include"})
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((message: AddToCartResponse) => {
        if (!message.success) throw new Error(message.data.message)
        setCartCount(message.data.summary_qty || 0)
        toast("Book added to cart")
      })
      .catch(e => {
        console.warn("An error occurred when adding the book to the cart: " + e.toString())
        window.location.href = cartUrl
      })
  }

  return (
    <form className="rs-mb-1 rs-pb-1 border-b-2 border-fog @container" action={submitForm} onSubmit={handleFormSubmit}>
      <input type="hidden" name="title" value={bookTitle} />
      <label className="sr-only">
        Do not fill with any information
        <input name="email" type="email" />
      </label>

      <fieldset className="rs-mb-1 space-y-4">
        <legend className="sr-only">Format</legend>
        <FormatChoices
          isIntl={isIntl}
          clothIsbn={clothIsbn}
          paperIsbn={paperIsbn}
          ebookIsbn={ebookIsbn}
          clothPrice={clothIsbn ? priceData?.supClothPrice || false : undefined}
          clothSale={priceData?.supClothSale}
          paperPrice={paperIsbn ? priceData?.supPaperPrice || false : undefined}
          paperSale={priceData?.supPaperSale}
          ebookPrice={
            shouldShowEbookButton && ebookIsbn && (epub || pdf) ? priceData?.supDigitalPrice || false : undefined
          }
          ebookSale={priceData?.supDigitalSale}
          onChange={onFormatChange}
          altIsbn={altIsbn}
          altFormat={altFormat}
          altPrice={altIsbn ? priceData?.supAltPrice || false : undefined}
        />
      </fieldset>

      {ebookSelected && (
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
            Must be read using the{" "}
            <Link href="/ebooks" className="font-normal text-black">
              Academic Reader app
            </Link>
            . After purchasing, you will receive an email with instructions to access your ebook.
          </div>
        </div>
      )}

      {(hasIntlCart || priceData?.supIntlCart) && !ebookSelected && (
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

      {!ebookSelected && isIntl && !priceData?.supComingSoon && (
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
        {(ebookSelected || !isIntl) && !priceData?.supComingSoon && !priceData?.supPreorder && "Add to cart"}
        {!ebookSelected && !priceData?.supComingSoon && priceData?.supPreorder && isIntl && "Preorder from CAP"}
        {!ebookSelected && !priceData?.supComingSoon && !priceData?.supPreorder && isIntl && "Purchase from CAP"}
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

      {!isIntl && priceData?.supDigitalPrice && priceData?.supDigitalSale && (
        <div className="rs-mt-1 text-18">
          <div>
            EBook List Price: <del className="italic">{formatCurrency(priceData?.supDigitalPrice)}</del>
          </div>
          <div>
            Save{" "}
            <ins className="no-underline">
              {formatCurrency(priceData?.supDigitalPrice - priceData?.supDigitalSale)} ({priceData?.supDigitalDiscount}
              %)
            </ins>
          </div>
        </div>
      )}
    </form>
  )
}

const FormatChoices = ({
  altIsbn,
  altFormat,
  altPrice,
  clothIsbn,
  clothPrice,
  clothSale,
  paperIsbn,
  ebookIsbn,
  ebookPrice,
  ebookSale,
  paperPrice,
  paperSale,
  onChange,
  isIntl,
}: {
  altIsbn?: NodeSupBook["supBookIsbn13Alt"]
  altFormat?: NodeSupBook["supBookAltFormat"]
  clothIsbn?: NodeSupBook["supBookIsbn13Cloth"]
  paperIsbn?: NodeSupBook["supBookIsbn13Paper"]
  ebookIsbn?: NodeSupBook["supBookIsbn13Digital"]
  altPrice?: Maybe<number | false>
  clothPrice?: Maybe<number | false>
  clothSale?: Maybe<number | false>
  ebookPrice?: Maybe<number | false>
  ebookSale?: Maybe<number | false>
  paperPrice?: Maybe<number | false>
  paperSale?: Maybe<number | false>
  onChange?: (_e: ChangeEvent<HTMLInputElement>) => void
  isIntl: boolean
}) => {
  const defaultChoice: "cloth" | "paper" | "ebook" | "alt" = clothIsbn
    ? "cloth"
    : paperIsbn
      ? "paper"
      : ebookIsbn
        ? "ebook"
        : "alt"

  return (
    <>
      <input type="hidden" name="alt-format" value={altFormat?.toUpperCase()} />

      {clothIsbn && clothPrice !== undefined && (
        <FormatChoice
          label="Hardcover"
          isIntl={isIntl}
          price={clothPrice}
          salePrice={clothSale}
          typeName="cloth"
          isbn={clothIsbn}
          defaultChecked={defaultChoice === "cloth"}
          onInputChange={onChange}
          icon={<BookOpenIcon width={24} className="text-fog-dark" />}
        />
      )}
      {paperIsbn && paperPrice !== undefined && (
        <FormatChoice
          label="Paperback"
          isIntl={isIntl}
          price={paperPrice}
          salePrice={paperSale}
          typeName="paper"
          isbn={paperIsbn}
          defaultChecked={defaultChoice === "paper"}
          onInputChange={onChange}
          icon={<BookOpenIconOutline width={24} className="text-fog-dark" />}
        />
      )}
      {ebookIsbn && ebookPrice !== undefined && (
        <FormatChoice
          label="EBook"
          isIntl={false}
          price={ebookPrice}
          salePrice={ebookSale}
          typeName="ebook"
          isbn={ebookIsbn}
          defaultChecked={defaultChoice === "ebook"}
          onInputChange={onChange}
          removeUsCan
          icon={<DeviceTabletIcon width={24} className="text-fog-dark" />}
        />
      )}

      {altIsbn && altPrice !== undefined && (
        <FormatChoice
          typeName="alt"
          isbn={altIsbn}
          defaultChecked={defaultChoice === "alt"}
          onInputChange={onChange}
          label={altFormat}
          isIntl={isIntl}
          price={altPrice}
          icon={<DeviceTabletIcon width={24} className="text-fog-dark" />}
        />
      )}
    </>
  )
}

const FormatChoice = ({
  label,
  isIntl,
  price,
  salePrice,
  typeName,
  isbn,
  defaultChecked,
  onInputChange,
  removeUsCan,
  icon,
  ...props
}: {
  label: string | ReactNode
  isIntl: boolean
  price?: Maybe<number | false>
  salePrice?: Maybe<number | false>
  typeName: string
  isbn: string
  defaultChecked?: boolean
  onInputChange?: (_e: ChangeEvent<HTMLInputElement>) => void
  removeUsCan?: boolean
  icon: ReactNode
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
        <span className="flex w-full items-center justify-between gap-4">
          <span className="flex w-full flex-col items-center justify-between gap-5 @lg:flex-row @lg:gap-0">
            <span className="font-semibold group-hover:underline md:text-[0.85em]">{label}</span>

            {!isIntl && price && !removeUsCan && (
              <span className="mr-2 text-press-sand-dark @lg:ml-2 @lg:text-center md:text-[0.85em]">US/CAN</span>
            )}

            {!isIntl && price && (
              <span className="flex flex-col items-center text-press-sand-dark md:text-[0.85em]">
                {salePrice && <del>{formatCurrency(price)}</del>}
                <span>{formatCurrency(salePrice || price)}</span>
              </span>
            )}
          </span>
          {icon}
        </span>
      </span>
    </label>
  )
}

export default PreCartClient
