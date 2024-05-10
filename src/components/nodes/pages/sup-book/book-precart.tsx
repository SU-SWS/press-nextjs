"use client";

import useIsInternational from "@lib/hooks/useIsInternational";
import Button from "@components/elements/button";
import {FormEvent, useId, useState} from "react";
import {ArrowRightIcon,} from "@heroicons/react/16/solid";
import {Maybe} from "@lib/gql/__generated__/drupal";
import {BookmarkIcon, BookOpenIcon, DeviceTabletIcon} from "@heroicons/react/24/outline";
import {useRouter} from "next/navigation";
import {formatCurrency} from "@lib/utils/format-currency";

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

const BookPreCart = ({
  bookTitle,
  usClothPrice,
  usClothSalePrice,
  usClothSaleDiscount,
  usPaperPrice,
  usPaperSalePrice,
  usPaperSaleDiscount,
  usDigitalPrice,
  clothIsbn,
  paperIsbn,
  digitalIsbn,
  hasIntlCart = true,
}: Props) => {

  const router = useRouter();
  const defaultChoice = usClothPrice ? "cloth" : usPaperPrice ? "paper" : "digital"
  const [formatChoice, setFormatChoice] = useState(defaultChoice)

  const [isIntl, setIntl] = useIsInternational()

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let isbn: Maybe<string> | undefined = ""
    switch (formatChoice) {
      case "cloth":
        isbn = clothIsbn
        break;

      case "paper":
        isbn = paperIsbn
        break;

      case "digital":
        isbn = digitalIsbn
        break;
    }

    if (isIntl) {
      const title = bookTitle.replace(/[^a-zA-Z\d\s:]/, "").replace(/ /, "-")
      router.push(`https://www.combinedacademic.co.uk/${isbn}/${title}`)
      return;
    }
    router.push(`https://add-to-cart-2.supadu.com/add-to-cart?isbn=${isbn}&client=indiepubs-stanford-university-press`)
  }

  return (
    <form className="@container" onSubmit={onFormSubmit}>
      <fieldset className="mb-5">
        <legend className="sr-only">Format</legend>
        {!isIntl &&
          <UsFormatChoices
            clothPrice={usClothSalePrice || usClothPrice}
            paperPrice={usPaperSalePrice || usPaperPrice}
            digitalPrice={usDigitalPrice}
            onChange={setFormatChoice}
          />
        }

        {isIntl &&
          <IntlFormatChoices
            clothIsbn={clothIsbn}
            paperIsbn={paperIsbn}
            onChange={setFormatChoice}
          />
        }
      </fieldset>

      {hasIntlCart &&
        <fieldset>
          <legend className="font-semibold">Region</legend>
          <div className="flex flex-wrap border-2 border-black-40 p-1 mb-5">
            <div className="flex-1 min-w-fit">
              <input
                id="us-region"
                className="sr-only peer"
                type="radio"
                name="intl"
                value="us"
                checked={!isIntl}
                onChange={() => setIntl(false)}
              />
              <label
                htmlFor="us-region"
                className="block text-center p-5 peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline hover:underline hover:bg-fog-light"
              >
                US/Canada
              </label>
            </div>
            <div className="flex-1 min-w-fit">
              <input
                id="intl-region"
                className="sr-only peer"
                type="radio"
                name="intl"
                value="intl"
                checked={isIntl}
                onChange={() => setIntl(true)}
              />
              <label
                htmlFor="intl-region"
                className="block text-center p-5 peer-checked:bg-cardinal-red-dark peer-checked:text-white peer-focus-visible:underline hover:underline hover:bg-fog-light"
              >
                International
              </label>
            </div>
          </div>
        </fieldset>
      }

      {isIntl &&
        <p>
          For customer shipments outside the US and Canada, please use the button below to order from our partner,
          Combine Academic Publishers.
        </p>
      }

      <div>
        <Button buttonElem type="submit" className="w-full flex items-center justify-center">
          Add to cart<ArrowRightIcon width={30}/>
        </Button>
      </div>

      {(formatChoice === "cloth" && !isIntl && usClothPrice && usClothSalePrice) &&
        <div className="my-5">
          <div>List Price: <span className="line-through">{formatCurrency(usClothPrice)}</span></div>
          <div>Save {formatCurrency(usClothPrice - usClothSalePrice)} ({usClothSaleDiscount}%)</div>
        </div>
      }

      {(formatChoice === "paper" && !isIntl && usPaperPrice && usPaperSalePrice) &&
        <div className="my-5">
          <div>List Price: <span className="line-through">{formatCurrency(usPaperPrice)}</span></div>
          <div>Save {formatCurrency(usPaperPrice - usPaperSalePrice)} ({usPaperSaleDiscount}%)</div>
        </div>
      }

    </form>
  )
}

const UsFormatChoices = ({
  clothPrice,
  paperPrice,
  digitalPrice,
  onChange
}: {
  clothPrice?: Maybe<number>
  paperPrice?: Maybe<number>
  digitalPrice?: Maybe<number>
  onChange: (_format: string) => void
}) => {
  const defaultChoice = clothPrice ? "cloth" : paperPrice ? "paper" : "digital"
  const id = useId();
  return (
    <>
      {clothPrice &&
        <div className="mb-3">
          <input
            className="sr-only peer"
            id={`${id}-cloth`}
            type="radio"
            name="format"
            value="cloth"
            defaultChecked={defaultChoice === "cloth"}
            onChange={() => onChange("cloth")}
          />
          <label
            htmlFor={`${id}-cloth`}
            className="group flex items-center p-5 border-3 peer-checked:border-cardinal-red-dark peer-focus-visible:underline peer-focus-visible:bg-fog-light hover:bg-fog-light"
          >
            <span className="flex w-full items-center">
              <span className="flex w-full flex-col @lg:flex-row justify-between">
                <span className="font-semibold group-hover:underline">Hardcover</span>
                <span className="flex items-center">
                  <span className="text-press-sand-dark">US/CAN</span>
                  <span>{formatCurrency(clothPrice)}</span>
                </span>
              </span>
              <BookmarkIcon width={30} className="text-fog-dark"/>
            </span>
          </label>
        </div>
      }
      {paperPrice &&
        <div className="mb-3">
          <input
            className="sr-only peer"
            id={`${id}-paper`}
            type="radio"
            name="format"
            value="paper"
            defaultChecked={defaultChoice === "paper"}
            onChange={() => onChange("paper")}
          />
          <label
            htmlFor={`${id}-paper`}
            className="group flex items-center p-5 border-3 peer-checked:border-cardinal-red-dark peer-focus-visible:underline peer-focus-visible:bg-fog-light hover:bg-fog-light"
          >
            <span className="flex w-full items-center">
              <span className="flex w-full flex-col @lg:flex-row justify-between">
                <span className="font-semibold group-hover:underline">Paperback</span>
                <span className="flex items-center">
                  <span className="text-press-sand-dark">US/CAN</span>
                  <span>{formatCurrency(paperPrice)}</span>
                </span>
              </span>
              <BookOpenIcon width={30} className="text-fog-dark"/>
            </span>
          </label>
        </div>
      }
      {digitalPrice &&
        <div>
          <input
            className="sr-only peer"
            id={`${id}-digital`}
            type="radio"
            name="format"
            value="digital"
            defaultChecked={defaultChoice === "digital"}
            onChange={() => onChange("digital")}
          />
          <label
            htmlFor={`${id}-digital`}
            className="group flex items-center p-5 border-3 peer-checked:border-cardinal-red-dark peer-focus-visible:underline peer-focus-visible:bg-fog-light hover:bg-fog-light"
          >
            <span className="flex w-full items-center">
              <span className="flex w-full flex-col @lg:flex-row justify-between">
                <span className="font-semibold group-hover:underline">eBook</span>
                <span className="flex items-center">
                  <span className="text-press-sand-dark">US/CAN</span>
                  <span>{formatCurrency(digitalPrice)}</span>
                </span>
              </span>
              <DeviceTabletIcon width={30} className="text-fog-dark"/>
            </span>
          </label>
        </div>
      }
    </>
  )
}

const IntlFormatChoices = ({
  clothIsbn,
  paperIsbn,
  onChange
}: {
  clothIsbn?: Maybe<string>
  paperIsbn?: Maybe<string>
  onChange: (_format: string) => void
}) => {
  const defaultChoice = clothIsbn ? "cloth" : "paper"
  const id = useId();
  return (
    <>
      {clothIsbn &&
        <div className="mb-3">
          <input
            className="sr-only peer"
            id={`${id}-cloth`}
            type="radio"
            name="format"
            value="cloth"
            defaultChecked={defaultChoice === "cloth"}
            onChange={() => onChange("cloth")}
          />
          <label
            htmlFor={`${id}-cloth`}
            className="group flex items-center p-5 border-3 peer-checked:border-cardinal-red-dark peer-focus-visible:underline peer-focus-visible:bg-fog-light hover:bg-fog-light"
          >
            <span className="flex w-full items-center justify-between font-semibold">
              <span className="group-hover:underline">Hardcover</span>
              <BookmarkIcon width={30} className="text-fog-dark"/>
            </span>
          </label>
        </div>
      }
      {paperIsbn &&
        <div>
          <input
            className="sr-only peer"
            id={`${id}-paper`}
            type="radio"
            name="format"
            value="paper"
            defaultChecked={defaultChoice === "paper"}
            onChange={() => onChange("paper")}
          />
          <label
            htmlFor={`${id}-paper`}
            className="group flex items-center p-5 border-3 peer-checked:border-cardinal-red-dark peer-focus-visible:underline peer-focus-visible:bg-fog-light hover:bg-fog-light"
          >
            <span className="flex w-full items-center justify-between font-semibold">
              <span className="group-hover:underline">Paperback</span>
              <BookOpenIcon width={30} className="text-fog-dark"/>
            </span>
          </label>
        </div>
      }
    </>
  )
}


export default BookPreCart;