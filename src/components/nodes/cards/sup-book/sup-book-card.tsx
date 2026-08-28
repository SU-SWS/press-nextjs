import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import Image from "next/image"
import {BookmarkIcon} from "@heroicons/react/24/outline"
import cn from "@lib/utils/className"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeSupBook
  headingLevel?: "h2" | "h3"
  /**
   * If the card is displayed on top of a dark background.
   */
  darkBg?: boolean
}

const SupBookCard = ({node, headingLevel, darkBg, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2

  return (
    <div {...props} className={cn("mx-auto max-w-3xl", props.className)}>
      <div className="relative">
        <div
          className={cn("rs-mb-1 relative aspect-[2/3] w-full", {
            "aspect-[3/2]": node.supBookType === "digital_project",
          })}
        >
          <Image
            className="ed11y-ignore object-cover"
            src={node.supBookImage?.mediaImage.url || "/default-book-image.jpg"}
            alt=""
            fill
            sizes="400px"
          />
          {node.supBookAwards && (
            <div className="absolute left-5 top-0 flex max-w-[90%] items-center justify-between gap-3 bg-fog py-2 pl-3 pr-5 text-[0.65em]">
              <BookmarkIcon width={20} className={cn("fill-stone-dark", {"text-fog": darkBg})} />
              Award winner
            </div>
          )}
        </div>

        <Heading className="type-0 mb-5 font-normal xl:text-21">
          <Link
            className={cn("stretched-link font-medium text-stone-dark", {
              "text-fog-light hocus:text-fog-light": darkBg,
            })}
            href={node.path || "#"}
          >
            {node.title}
          </Link>
        </Heading>
      </div>

      {node.supBookSubtitle && (
        <div className={cn("rs-mb-0 text-[0.8em] text-press-sand-dark", {"text-press-sand-light": darkBg})}>
          {node.supBookSubtitle}
        </div>
      )}

      {node.supBookAuthorsFull && (
        <div className={cn("mb-0 text-[0.8em] text-press-sand-dark", {"text-press-sand-light": darkBg})}>
          {node.supBookAuthorsFull}
        </div>
      )}
    </div>
  )
}
export default SupBookCard
