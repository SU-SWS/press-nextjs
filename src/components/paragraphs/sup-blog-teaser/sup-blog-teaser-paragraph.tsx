import {HTMLAttributes} from "react"
import {ParagraphSupBlogTeaser} from "@lib/gql/__generated__/drupal"
import {H2, H3} from "@components/elements/headers"
import Link from "@components/elements/link"
import Image from "next/image"
import {ArrowRightIcon} from "@heroicons/react/16/solid"
import {twMerge} from "tailwind-merge"

type Props = HTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupBlogTeaser
}

const SupBlogTeaserParagraph = ({paragraph, ...props}: Props) => {
  return (
    <div
      {...props}
      className={twMerge("centered lg:max-w-1200", props.className)}
    >
      <div className="flex items-center justify-between">
        {paragraph.supBlogTeaserHeader && <H2>{paragraph.supBlogTeaserHeader}</H2>}
        {paragraph.supBlogTeaserLink?.url && (
          <Link
            href={paragraph.supBlogTeaserLink.url}
            className="group flex items-center gap-5 font-normal text-archway-dark no-underline"
          >
            <span className="group-hocus:underline">{paragraph.supBlogTeaserLink.title}</span>
            <ArrowRightIcon width={20} />
          </Link>
        )}
      </div>

      {paragraph.supBlogTeaserItems && (
        <ul className="list-unstyled grid gap-10 @7xl:grid-cols-2">
          {paragraph.supBlogTeaserItems.map(blogItem => (
            <li
              key={blogItem.id}
              className="relative aspect-[4/3] w-full"
            >
              {blogItem.supBlogImage?.mediaImage && (
                <Image
                  className="object-cover"
                  src={blogItem.supBlogImage.mediaImage.url}
                  alt={blogItem.supBlogImage.mediaImage.alt || ""}
                  fill
                />
              )}
              <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-black-true from-60% to-black-40 opacity-70" />

              <div className="absolute top-0 h-full w-full overflow-y-scroll p-20">
                {/* URL will always be populated. */}
                <Link
                  href={blogItem.supBlogUrl.url || "#"}
                  className="group stretched-link no-underline"
                  aria-labelledby={blogItem.id}
                >
                  <H3
                    id={blogItem.id}
                    className="border-t border-white pt-10 text-white group-hocus:underline"
                  >
                    {blogItem.supBlogTitle}
                  </H3>
                </Link>

                <p className="text-white">{blogItem.supBlogBody}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default SupBlogTeaserParagraph
