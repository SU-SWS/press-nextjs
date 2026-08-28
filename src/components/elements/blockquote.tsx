import {HTMLAttributes} from "react"
import cn from "@lib/utils/className"

const Blockquote = ({children, ...props}: HTMLAttributes<HTMLElement>) => {
  return (
    <blockquote className={cn("mx-12 mb-10 max-w-[100ch] text-3xl leading-10", props.className)}>{children}</blockquote>
  )
}
export default Blockquote
