import Link, {LinkProps} from "@components/elements/link"
import {ArrowLongRightIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {twMerge} from "tailwind-merge"

const ActionLink = ({children, className, ...props}: LinkProps) => {
  return (
    <Link
      {...props}
      className={twMerge(
        "relative flex w-fit items-center",
        clsx({
          "group text-digital-red hocus:text-archway-dark": !className?.includes("button"),
        }),
        className?.replace("link--action", "")
      )}
    >
      {children}
      <ArrowLongRightIcon height={20} className="ml-2 text-digital-red group-hocus:text-archway-dark" />
    </Link>
  )
}
export default ActionLink
