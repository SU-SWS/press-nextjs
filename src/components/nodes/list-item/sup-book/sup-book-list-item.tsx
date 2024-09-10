import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeSupBook
  headingLevel?: "h2" | "h3"
}

const SupBookListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("mx-auto w-full max-w-[500px] border border-black-20 p-10 shadow-xl", props.className)}
    >
      <div className="flex flex-col">
        <Heading className="type-1 order-first xl:text-26" id={node.id}>
          <Link href={node.path}>{node.title}</Link>
        </Heading>
        <div className="font-bold">Publication</div>
      </div>
    </article>
  )
}
export default SupBookListItem
