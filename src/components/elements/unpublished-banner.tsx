import {HTMLAttributes, JSX} from "react"
import {twMerge} from "tailwind-merge"
import {ExclamationTriangleIcon} from "@heroicons/react/20/solid"

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * If the item is published or not.
   */
  status?: boolean
  /**
   * Unpublished message.
   */
  message: string | JSX.Element
}
const UnpublishedBanner = ({status, message, children, ...props}: Props) => {
  if (status !== false) return <>{children}</>
  return (
    <div className="border-dotted border-illuminating">
      <div
        {...props}
        className={twMerge("bg-illuminating p-5 text-4xl font-bold", props.className)}
      >
        <div className="centered flex items-center gap-10">
          <ExclamationTriangleIcon width={30} />
          {message}
        </div>
      </div>

      {children}
    </div>
  )
}
export default UnpublishedBanner
