import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import Image from "next/image"
import {BookmarkIcon} from "@heroicons/react/24/outline"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeSupBook
  headingLevel?: "h2" | "h3"
}

const SupBookCard = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <div {...props} className={twMerge("mx-auto max-w-3xl", props.className)}>
      <div className="relative">
        <div className="rs-mb-1 relative aspect-[2/3] w-full">
          <Image
            className="ed11y-ignore object-cover"
            src={node.supBookImage?.mediaImage.url || "/default-book-image.jpg"}
            alt=""
            fill
            sizes="400px"
          />
          {node.supBookAwards && (
            <div className="absolute left-5 top-0 flex max-w-[90%] items-center gap-3 bg-fog py-2 pl-3 pr-5">
              <BookmarkIcon width={20} className="fill-stone-dark" />
              Award winner
            </div>
          )}
        </div>

        <Heading className="type-2 mb-5 font-normal">
          <Link className="stretched-link font-normal text-stone-dark" href={node.path}>
            {node.title}
          </Link>
        </Heading>
      </div>

      {node.supBookSubtitle && <div className="rs-mb-3 text-press-sand-dark">{node.supBookSubtitle}</div>}

      {node.supBookAuthorsFull && <div className="mb-0 text-press-sand-dark">{node.supBookAuthorsFull}</div>}
    </div>
  )
}
export default SupBookCard
