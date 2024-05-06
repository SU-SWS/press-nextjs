import {NodeSupBook} from "@lib/gql/__generated__/drupal";
import {H1} from "@components/elements/headers";
import {HTMLAttributes} from "react";
import Rows from "@components/paragraphs/rows/rows";
import Link from "@components/elements/link";
import {BookmarkIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookExcerptPage = ({node, ...props}: Props) => {
  return (
    <div className="centered flex flex-col gap-10">
      <article className="pt-32 order-last" {...props}>
        <div className="flex gap-20 mb-20">

          <div className="flex flex-col gap-20">
            <H1>
              {node.title}
            </H1>
            {node.supBookSubjects &&
              <div className="order-first">
                {node.supBookSubjects[0].parent?.name || node.supBookSubjects[0].name}
              </div>
            }
            {node.supBookSubtitle &&
              <div>{node.supBookSubtitle}</div>
            }

            {node.supBookAuthorsFull &&
              <div>{node.supBookAuthorsFull}</div>
            }

            {node.supBookAvailDesc &&
              <div>{node.supBookAvailDesc}</div>
            }
          </div>

          {node.supBookImage?.mediaImage &&
            <div className="relative order-first w-1/3">
              {(node.supBookAwards || true) &&
                <div className="absolute top-0 left-0 bg-stone-400 p-3">
                  <span className="flex items-center"><BookmarkIcon width={20}
                                                                    className="fill-archway"/> Award Winner</span>
                </div>
              }
              <Image
                src={node.supBookImage.mediaImage.url}
                alt={node.supBookImage.mediaImage.alt || ""}
                height={node.supBookImage.mediaImage.height}
                width={node.supBookImage.mediaImage.width}
              />
            </div>
          }
        </div>
        <Rows components={node.supBookExcerpts}/>
      </article>

      <Link href={node.path} className="pt-20 flex items-center w-fit">
        <ArrowLeftIcon width={20}/>
        Back to {node.title}
      </Link>
    </div>
  )
}

export default SupBookExcerptPage