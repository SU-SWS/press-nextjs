import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {H1, H2} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import {Tab, TabPanel, Tabs, TabsList} from "@components/elements/tabs"
import Wysiwyg from "@components/elements/wysiwyg"
import BookPreCart from "@components/nodes/pages/sup-book/book-precart"
import {formatCurrency} from "@lib/utils/format-currency"
import {BookmarkIcon, ClipboardIcon, DocumentDuplicateIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import BookAwards from "@components/nodes/pages/sup-book/book-awards"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = async ({node, ...props}: Props) => {
  const hasExcerptAndMore = node.supBookExcerpts || node.supBookTableOfContents || !!(await getBookAncillaryContents(node.id)).length

  const lowestPrice = Math.min(node.supBookClothSalePrice || 9999, node.supBookPaperSalePrice || 9999, node.supBookPriceCloth || 9999, node.supBookPriceDigital || 9999, node.supBookPricePaper || 9999)
  const awards = node.supBookAwards?.sort((a, b) => (a.supRank && b.supRank && a.supRank < b.supRank ? -1 : 1))

  return (
    <article
      className="centered pt-32"
      {...props}
    >
      <div className="mb-20 flex flex-col gap-24 lg:flex-row">
        <div className="flex flex-col gap-24 lg:flex-row xl:w-2/3">
          <div className="xl:w-7/12">
            <div className="mb-20 flex flex-col gap-10 border-b border-fog pb-20">
              <H1>{node.title}</H1>

              {node.supBookSubjects && <div className="order-first">{node.supBookSubjects[0].parent?.name || node.supBookSubjects[0].name}</div>}

              {node.supBookSubtitle && <div className="text-m3 font-medium">{node.supBookSubtitle}</div>}

              {node.supBookAuthorsFull && <div className="text-m2 text-press-sand-dark">{node.supBookAuthorsFull}</div>}

              {awards && (
                <div className="border-t border-fog">
                  <H2 className="flex w-fit items-center gap-2 bg-fog p-3 -text-m1 font-semibold">
                    <BookmarkIcon
                      width={20}
                      className="fill-archway"
                    />
                    Award Winner
                  </H2>
                  <BookAwards>
                    {awards.map(award => (
                      <div key={award.id}>{award.name}</div>
                    ))}
                  </BookAwards>
                </div>
              )}
            </div>

            <div className="mb-20 flex flex-col gap-2 border-b border-fog pb-20">
              {node.supBookImprint && <div className="font-semibold text-press-sand-dark">Imprint: {node.supBookImprint.name}</div>}

              <H2 className="-text-m1 font-normal">Book Details</H2>

              {node.supBookCopublisherName && <div className="text-press-sand-dark">{node.supBookCopublisherName}</div>}

              {node.supBookPubDateCloth?.time && (
                <div className="text-press-sand-dark">
                  {new Date(node.supBookPubDateCloth.time).toLocaleDateString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}

              {node.supBookPages && <div className="text-press-sand-dark">{node.supBookPages} Pages</div>}

              {lowestPrice && <div className="text-press-sand-dark">From {formatCurrency(lowestPrice)}</div>}

              {node.supBookSeries?.name && (
                <div>
                  Series
                  <br />
                  <a
                    href={`/search?q=${node.supBookSeries.name}`}
                    className="font-normal text-stone-dark"
                  >
                    {node.supBookSeries.name}
                  </a>
                </div>
              )}
            </div>

            {node.supBookIsbn13Cloth && <div>Hardcover ISBN: {node.supBookIsbn13Cloth}</div>}
            {node.supBookIsbn13Paper && <div>Paperback ISBN: {node.supBookIsbn13Paper}</div>}
            {node.supBookIsbn13Digital && <div>Ebook ISBN: {node.supBookIsbn13Digital}</div>}
          </div>

          <div className="order-first xl:w-5/12">
            <BookPageImage node={node} />

            {hasExcerptAndMore && (
              <Link
                href={`${node.path}/excerpts`}
                className="mx-auto flex w-fit items-center justify-center gap-3 border border-press-sand p-10 font-normal text-stone-dark no-underline hocus:underline"
              >
                <span>Excerpts + more</span>
                <DocumentDuplicateIcon
                  width={20}
                  className="text-stone-dark"
                />
              </Link>
            )}
          </div>
        </div>

        <div className="xl:w-1/3">
          <div className="mb-10 border-b border-fog pb-10">
            <BookPreCart
              bookTitle={node.title}
              usClothPrice={node.supBookPriceCloth}
              usClothSalePrice={node.supBookClothSalePrice}
              usClothSaleDiscount={node.supBookClothSalePercent}
              usPaperPrice={node.supBookPricePaper}
              usPaperSalePrice={node.supBookPaperSalePrice}
              usPaperSaleDiscount={node.supBookPaperSalePercent}
              usDigitalPrice={node.supBookPriceDigital}
              clothIsbn={node.supBookIsbn13Cloth}
              paperIsbn={node.supBookIsbn13Paper}
              digitalIsbn={node.supBookIsbn13Digital}
            />
          </div>

          {node.supBookERetailers && (
            <div className="mb-10 border-b border-fog pb-10">
              <div className="mb-8">Also Available from</div>
              <ul className="list-unstyled [&_a]:font-normal [&_a]:text-digital-red">
                {node.supBookERetailers.map((link, i) => (
                  <li
                    key={`e-book-retailer-${i}`}
                    className="mb-0"
                  >
                    <a href={link.url || "#"}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={node.path + "/desk-examination-copy-requests"}
            className="flex items-center gap-3 font-normal text-stone-dark"
          >
            <ClipboardIcon
              width={20}
              className="text-press-sand-dark"
            />{" "}
            Desk, Examination, or Review Copy Requests
          </Link>
        </div>
      </div>

      <Tabs className="mb-20 border-b border-fog pb-20">
        <div className="mb-20 border-b border-fog">
          <TabsList className="mx-auto max-w-5xl">
            {node.supBookDescription?.processed && <Tab className="p-10">Description</Tab>}
            {node.supBookReviews && <Tab className="p-10">Reviews</Tab>}
            {node.supBookAuthorInfo && <Tab className="p-10">About the Author</Tab>}
          </TabsList>
        </div>
        <div className="mx-auto max-w-5xl">
          {node.supBookDescription?.processed && (
            <TabPanel>
              <Wysiwyg html={node.supBookDescription?.processed} />
            </TabPanel>
          )}
          {node.supBookReviews && (
            <TabPanel>
              <Wysiwyg html={node.supBookReviews.processed} />
            </TabPanel>
          )}
          {node.supBookAuthorInfo && (
            <TabPanel>
              <Wysiwyg html={node.supBookAuthorInfo.processed} />
            </TabPanel>
          )}
        </div>
      </Tabs>

      {node.supBookSubjects && (
        <div className="mx-auto max-w-5xl">
          <H2 className="text-m1 font-bold">Related Subjects</H2>
          <ul className="list-unstyled flex flex-wrap">
            {node.supBookSubjects.map(subject => {
              const linkParams = new URLSearchParams()
              if (subject.parent?.name) {
                linkParams.set("subjects", subject.parent.name)
                linkParams.set("q", subject.name)
              } else {
                linkParams.set("subjects", subject.name)
              }

              return (
                <li
                  key={subject.id}
                  className="min-w-fit flex-1"
                >
                  <a
                    href={`/search?${linkParams.toString()}`}
                    className="font-normal text-stone-dark"
                  >
                    {subject.parent?.name && `${subject.parent.name} / `}
                    {subject.name}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </article>
  )
}
export default SupBookPage
