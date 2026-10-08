import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeSupBook} from "@lib/gql/__generated__/graphql"
import Image from "@components/images/image"
import {BookmarkIcon} from "@heroicons/react/24/outline"
import cn from "@lib/utils/className"
import {formatHtml} from "@components/elements/wysiwyg"

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
          className={cn("relative rs-mb-1 aspect-2/3 w-full", {
            "aspect-3/2": node.supBookType === "digital_project",
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
            <div className="absolute top-0 left-12.5 flex max-w-[90%] items-center justify-between gap-7.5 bg-fog py-5 pr-12.5 pl-7.5 text-[0.65em]">
              <BookmarkIcon width={20} className={cn("fill-stone-dark", {"text-fog": darkBg})} />
              Award winner
            </div>
          )}
        </div>

        <Heading className="mb-12.5 type-0 font-normal xl:text-21">
          <Link
            className={cn("stretched-link font-medium text-stone-dark", {
              "text-fog-light hocus:text-fog-light": darkBg,
            })}
            href={node.path || "#"}
          >
            {formatHtml(node.title)}
          </Link>
        </Heading>
      </div>

      {node.supBookSubtitle && (
        <div className={cn("rs-mb-0 text-[0.8em] text-press-sand-dark", {"text-press-sand-light": darkBg})}>
          {formatHtml(node.supBookSubtitle)}
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
