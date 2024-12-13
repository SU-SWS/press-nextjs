import {MenuItem as MenuItemType, NodeSupBookAncillary} from "@lib/gql/__generated__/drupal.d"
import {H1} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Rows from "@components/paragraphs/rows/rows"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BackToLink from "@components/elements/back-to-link"
import {twMerge} from "tailwind-merge"
import Wysiwyg from "@components/elements/wysiwyg"
import SideNav from "@components/menu/side-nav"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBookAncillary
}

const SupBookAncillaryPage = async ({node, ...props}: Props) => {
  const book = node.supAncillaryBook

  const ancillaryPages = await getBookAncillaryContents(node.supAncillaryBook.id)
  const ancillaryMenuItems: MenuItemType[] = ancillaryPages.map(page => ({
    id: page.id,
    children: [],
    url: page.path,
    title: page.title,
    attributes: {},
    expanded: true,
    internal: true,
    langcode: {},
  }))

  return (
    <BackToLink
      {...props}
      href={book.path + "/excerpts"}
      className={twMerge("centered", props.className)}
      linkClasses="flex w-fit items-center gap-5"
      title="Excerpts + more"
      childrenProps={{className: "centered rs-mt-4 flex gap-[17.1rem]"}}
      isArticle
    >
      <NodePageMetadata key={node.id} metatags={node.metatag} pageTitle={`${book.title}: ${node.title}`} />
      <H1 className="sr-only">
        {node.title} for <em>{book.title}</em>
      </H1>

      <aside className="hidden w-1/4 shrink-0 lg:block">
        <a href="#page-content" className="skiplink">
          Skip secondary navigation
        </a>
        {node.supAncillaryBook.supBookImage?.mediaImage && (
          <div className="rs-mb-3 relative order-first w-full shrink-0">
            <BookPageImage node={node.supAncillaryBook} />
          </div>
        )}
        <SideNav menuItems={ancillaryMenuItems} activeTrail={[node.id]} />
      </aside>

      <div id="page-content" className="centered flex-grow lg:max-w-[900px]">
        <div className="rs-mb-4 flex flex-col md:flex-row">
          <div className="flex flex-col">
            <div className="type-2 font-medium xl:text-[3.3rem]">{book.title}</div>
            {node.supAncillaryBook.supBookSubtitle && (
              <div className="type-1 mt-5 font-medium xl:text-26">{node.supAncillaryBook.supBookSubtitle}</div>
            )}

            {node.supAncillaryBook.supBookAuthorsFull && (
              <div className="type-0 mt-5 text-press-sand-dark xl:text-21">
                {node.supAncillaryBook.supBookAuthorsFull}
              </div>
            )}
          </div>
        </div>

        <Wysiwyg html={node.body?.processed} />
        <Rows components={node.supAncillaryParagraphs} />
      </div>
    </BackToLink>
  )
}
export default SupBookAncillaryPage
