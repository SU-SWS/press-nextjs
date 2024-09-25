import Link, {LinkProps} from "@components/elements/link"
import {ArrowLongRightIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"

const ActionLink = ({children, className, ...props}: LinkProps) => {
  return (
    <Link
      {...props}
      className={clsx(
        "group relative flex w-fit flex-row items-center",
        {
          "text-digital-red hocus:text-archway-dark": !className?.includes("button"),
        },
        className?.replace("link--action", "")
      )}
    >
      {children}
      <ArrowLongRightIcon
        height={20}
        className="ml-2 text-digital-red transition-all group-hocus:translate-x-2 group-hocus:text-archway-dark"
      />
    </Link>
  )
}
export default ActionLink
