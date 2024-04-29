import {HTMLAttributes} from "react";
import {ParagraphSupBlogTeaser} from "@lib/gql/__generated__/drupal";
import {H2, H3} from "@components/elements/headers";
import Link from "@components/elements/link";
import Image from "next/image";

type Props = HTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphSupBlogTeaser
};

const SupBlogTeaserParagraph = ({paragraph, ...props}: Props) => {
  return (
    <div {...props}>
      {paragraph.supBlogTeaserHeader &&
        <H2>{paragraph.supBlogTeaserHeader}</H2>
      }
      {paragraph.supBlogTeaserLink?.url &&
        <Link href={paragraph.supBlogTeaserLink.url}>
          {paragraph.supBlogTeaserLink.title}
        </Link>
      }

      {paragraph.supBlogTeaserItems &&
        <ul className="list-unstyled grid @7xl:grid-cols-2 gap-10">
          {paragraph.supBlogTeaserItems.map(blogItem =>
            <li key={blogItem.id} className="relative aspect-[4/3] w-full">
              {blogItem.supBlogImage?.mediaImage &&
                <Image
                  className="object-cover"
                  src={blogItem.supBlogImage.mediaImage.url}
                  alt={blogItem.supBlogImage.mediaImage.alt || ""}
                  fill
                />
              }

              <div className="absolute top-0 h-full w-full p-20 overflow-y-scroll">
                <H3 id={blogItem.id}>
                  {blogItem.supBlogTitle}
                </H3>
                <p>{blogItem.supBlogBody}</p>

                {blogItem.supBlogUrl.url &&
                  <Link
                    href={blogItem.supBlogUrl.url}
                    className="stretched-link"
                    aria-labelledby={blogItem.id}
                  />
                }
              </div>
            </li>
          )}

        </ul>
      }
    </div>
  )
}
export default SupBlogTeaserParagraph;