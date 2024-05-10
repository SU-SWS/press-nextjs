import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeSupBook} from "@lib/gql/__generated__/drupal.d";
import Image from "next/image";
import {BookmarkIcon} from "@heroicons/react/24/outline";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeSupBook
  headingLevel?: "h2" | "h3"
}

const SupBookCard = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2;
  return (
    <div {...props} className={twMerge("max-w-3xl mx-auto", props.className)}>
      <div className="relative">

          <div className="relative aspect-[2/3] w-full mb-8">
            <Image
              className="object-cover"
              src={node.supBookImage?.mediaImage.url || "/default-book-image.jpg"}
              alt={node.supBookImage?.mediaImage.alt || ""}
              fill
              sizes="400px"
            />
            {node.supBookAwards &&
              <div className="absolute top-0 left-5 pl-3 pr-5 py-2 flex gap-3 items-center bg-fog">
                <BookmarkIcon width={20} className="fill-stone-dark"/>
                Award winner
              </div>
            }
          </div>


        <Heading className="font-normal text-m1 mb-8">
          <Link className="stretched-link text-stone-dark font-normal" href={node.path}>
            {node.title}
          </Link>
        </Heading>
      </div>

      {node.supBookSubtitle &&
        <div className="text-stone mb-16">
          {node.supBookSubtitle}
        </div>
      }

      {node.supBookAuthorsFull &&
        <div className="text-stone">
          {node.supBookAuthorsFull}
        </div>
      }
    </div>
  )
}
export default SupBookCard;