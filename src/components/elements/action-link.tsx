import Link, {LinkProps} from "@components/elements/link"
import {ArrowLongRightIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"

const ActionLink = ({children, className, ...props}: LinkProps) => {
  return (
    <Link
      {...props}
      className={clsx(
        "relative flex w-fit flex-row items-center",
        {
          "group text-digital-red hocus:text-archway-dark": !className?.includes("button"),
        },
        className?.replace("link--action", "")
      )}
    >
      {children}
      <ArrowLongRightIcon height={20} className="ml-2 text-digital-red group-hocus:text-archway-dark" />
    </Link>
  )
}
export default ActionLink
