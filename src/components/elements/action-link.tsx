import Link, {LinkProps} from "@components/elements/link"
import {ArrowLongRightIcon} from "@heroicons/react/20/solid"
import {twMerge} from "tailwind-merge"

const ActionLink = ({children, className, ...props}: LinkProps) => {
  return (
    <Link
      {...props}
      className={twMerge(
        "relative text-digital-red *:text-digital-red hocus:text-archway-dark *:hocus:text-archway-dark",
        className?.replace("link--action", "")
      )}
    >
      {children}
      <ArrowLongRightIcon height={20} className="mb-2 ml-2 inline-block" />
    </Link>
  )
}
export default ActionLink
