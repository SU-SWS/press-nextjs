import Link from "@components/elements/link";
import {ArrowLongRightIcon} from "@heroicons/react/20/solid";
import {HtmlHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Link url.
   */
  href: string
}

const ActionLink = ({ children, className, ...props }: Props) => {
  return (
    <Link {...props} className={twMerge("relative", className?.replace("link--action", ""))}>
      {children}
      <ArrowLongRightIcon height={20} className="ml-2 inline-block mb-2"/>
    </Link>
  )
}
export default ActionLink;