"use client";

import useIsInternational from "@lib/hooks/useIsInternational";
import Button from "@components/elements/button";
import {FormEvent, useState} from "react";
import {ArrowRightIcon,} from "@heroicons/react/16/solid";
import {Maybe} from "@lib/gql/__generated__/drupal";
import LocationSelection from "@components/elements/location-selection";
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

  const [isIntl] = useIsInternational()

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
    <form onSubmit={onFormSubmit}>
      <fieldset>
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
        <LocationSelection className="grid grid-cols-2 gap-5"/>
      }

      <div>
        <Button buttonElem type="submit" className="w-full flex items-center justify-center">
          Add to cart<ArrowRightIcon width={30}/>
        </Button>
      </div>

      {(formatChoice==="cloth" && !isIntl && usClothPrice && usClothSalePrice) &&
        <div>
          <div>List Price: <span className="line-through">{formatCurrency(usClothPrice)}</span></div>
          <div>Save {formatCurrency(usClothPrice - usClothSalePrice)} ({usClothSaleDiscount}%)</div>
        </div>
      }

      {(formatChoice==="paper" && !isIntl && usPaperPrice && usPaperSalePrice) &&
        <div>
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

  return (
    <>
      {clothPrice &&
        <label className="flex items-center">
          <input type="radio" name="format" value="cloth" defaultChecked={defaultChoice === "cloth"} onChange={() => onChange("cloth")}/>
          <span className="flex w-full items-center justify-between">
            <span>Hardcover</span> <span className="flex items-center"> US/CAN {formatCurrency(clothPrice)}
            <BookmarkIcon width={30}/></span>
          </span>
        </label>
      }
      {paperPrice &&
        <label className="flex items-center">
          <input type="radio" name="format" value="paper" defaultChecked={defaultChoice === "paper"} onChange={() => onChange("paper")}/>
          <span className="flex w-full items-center justify-between">
            <span>Paperback</span> <span className="flex items-center"> US/CAN {formatCurrency(paperPrice)}
            <BookOpenIcon width={30}/></span>
          </span>
        </label>
      }
      {digitalPrice &&
        <label className="flex items-center">
          <input type="radio" name="format" value="digital" defaultChecked={defaultChoice === "digital"} onChange={() => onChange("digital")}/>
          <span className="flex w-full items-center justify-between">
            <span>eBook</span> <span className="flex items-center"> US/CAN {formatCurrency(digitalPrice)}
            <DeviceTabletIcon width={30}/></span>
          </span>
        </label>
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
  return (
    <>
      {clothIsbn &&
        <label className="flex items-center">
          <input type="radio" name="format" value="cloth" defaultChecked={defaultChoice === "cloth"} onChange={() => onChange("cloth")}/>
          <span className="flex w-full items-center justify-between">Hardcover <BookmarkIcon width={30}/></span>
        </label>
      }
      {paperIsbn &&
        <label className="flex items-center">
          <input type="radio" name="format" value="paper" defaultChecked={defaultChoice === "paper"} onChange={() => onChange("paper")}/>
          <span className="flex w-full items-center justify-between">Paperback <BookOpenIcon width={30}/></span>
        </label>
      }
    </>
  )
}


export default BookPreCart;