import {NodeSupBook, TermSupBookSubject} from "@lib/gql/__generated__/drupal"
import {H1, H2, H3} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import {Tab, TabPanel, Tabs, TabsList} from "@components/elements/tabs"
import Wysiwyg from "@components/elements/wysiwyg"
import {formatCurrency} from "@lib/utils/format-currency"
import {BookmarkIcon, ClipboardIcon, DocumentDuplicateIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import BookAwards from "@components/nodes/pages/sup-book/book-awards"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import BookPrecart from "@components/nodes/pages/sup-book/book-precart"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const BookPage = async ({node, ...props}: Props) => {
  const hasExcerptAndMore = node.supBookExcerpts || node.supBookTableOfContents || !!(await getBookAncillaryContents(node.id)).length

  const lowestPrice = Math.min(node.supBookClothSalePrice || 9999, node.supBookPaperSalePrice || 9999, node.supBookPriceCloth || 9999, node.supBookPriceDigital || 9999, node.supBookPricePaper || 9999)
  const awards = node.supBookAwards?.sort((a, b) => (a.supRank && b.supRank && a.supRank < b.supRank ? -1 : 1))

  function createLinkParams(subject: TermSupBookSubject) {
    const linkParams = new URLSearchParams()

    if (subject.parent?.name) {
      linkParams.set("subjects", subject.parent.name)
      linkParams.set("q", subject.name)
    } else {
      linkParams.set("subjects", subject.name)
    }

    return linkParams.toString()
  }

  const bookSubject = node.supBookSubjects && createLinkParams(node.supBookSubjects[0])

  return (
    <article
      className="centered"
      {...props}
    >
      <>
        <div className="mb-20 flex flex-col md:flex-row md:gap-24 md:pt-32">
          <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-row justify-center gap-24 bg-fog-light px-20 pt-32 md:hidden">
            <div className="mb-16 hidden w-8/12 flex-col sm:flex md:hidden">
              <H1 className="type-3 mb-0">{node.title}</H1>

              {node.supBookSubjects && (
                <a
                  href={`/search?${bookSubject}`}
                  className="rs-mb-2 order-first -text-m1 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
                >
                  {node.supBookSubjects[0].parent?.name || node.supBookSubjects[0].name}
                </a>
              )}

              {node.supBookSubtitle && <div className="type-2 mt-5 font-medium">{node.supBookSubtitle}</div>}

              {node.supBookAuthorsFull && <div className="type-1 mt-5 text-press-sand-dark">{node.supBookAuthorsFull}</div>}
            </div>
            <div className="order-first w-5/12">
              <BookPageImage node={node} />
            </div>
          </div>
          <div className="flex flex-col md:w-2/3 md:gap-24 lg:flex-row">
            <div className="lg:w-5/8">
              <div className="rs-mb-0 rs-pb-3 flex flex-col border-b-2 border-fog">
                <div className="mt-7 flex flex-col sm:mt-0 sm:hidden md:flex">
                  <H1 className="type-3 mb-0">{node.title}</H1>

                  {node.supBookSubjects && (
                    <a
                      href={`/search?${bookSubject}`}
                      className="rs-mb-2 order-first -text-m1 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
                    >
                      {node.supBookSubjects[0].parent?.name || node.supBookSubjects[0].name}
                    </a>
                  )}

                  {node.supBookSubtitle && <div className="type-2 mt-5 font-medium">{node.supBookSubtitle}</div>}

                  {node.supBookAuthorsFull && <div className="type-1 mt-5 text-press-sand-dark">{node.supBookAuthorsFull}</div>}
                </div>

                {awards && (
                  <div className="rs-mt-1 border-t-2 border-fog">
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

              <div className="rs-mb-0 rs-pb-3 flex flex-col gap-2 border-b-2 border-fog">
                {node.supBookImprint && <div className="rs-mb-0 -text-m1 font-semibold text-press-sand-dark">Imprint: {node.supBookImprint.name}</div>}

                <H2 className="-text-m1 font-normal text-stone-dark">Book Details</H2>

                {node.supBookCopublisherName && <div className="text-press-sand-dark">{node.supBookCopublisherName}</div>}

                {node.supBookPubDateCloth?.time && (
                  <div className="-text-m1 text-press-sand-dark">
                    {new Date(node.supBookPubDateCloth.time).toLocaleDateString("en-us", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}

                {!!node.supBookPages && <div className="-text-m1 text-press-sand-dark">{node.supBookPages} Pages</div>}

                {lowestPrice && lowestPrice < 999 && <div className="-text-m1 text-press-sand-dark">From {formatCurrency(lowestPrice)}</div>}

                {node.supBookSeries?.name && (
                  <div>
                    Series
                    <br />
                    <a
                      href={`/search?q=${node.supBookSeries.name}`}
                      className="-text-m1 font-normal text-stone-dark"
                    >
                      {node.supBookSeries.name}
                    </a>
                  </div>
                )}
              </div>
              <div className="rs-mb-2 flex flex-col gap-2">
                {node.supBookIsbn13Cloth && <div className="-text-m1 text-stone-dark">Hardcover ISBN: {node.supBookIsbn13Cloth}</div>}
                {node.supBookIsbn13Paper && <div className="-text-m1 text-stone-dark">Paperback ISBN: {node.supBookIsbn13Paper}</div>}
                {node.supBookIsbn13Digital && <div className="-text-m1 text-stone-dark">Ebook ISBN: {node.supBookIsbn13Digital}</div>}
              </div>
            </div>

            <div className="lg:w-3/8">
              <div className="rs-mb-1 rs-pb-1 border-b-2 border-fog">
                <BookPrecart
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
                <div className="rs-mb-1 rs-pb-1 border-b-2 border-fog -text-m1">
                  <H3 className="-text-m1">Also Available from</H3>
                  <ul className="list-unstyled rs-mt-0 flex flex-col gap-3 [&_a]:font-normal [&_a]:text-digital-red">
                    {node.supBookERetailers.map((link, i) => (
                      <li
                        key={`e-book-retailer-${i}`}
                        className="mb-0"
                      >
                        <a
                          href={link.url || "#"}
                          className="font-normal underline-offset-[5px] hocus:text-stone-dark hocus:decoration-archway-dark hocus:decoration-2"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href={node.path + "/desk-examination-copy-requests"}
                className="flex items-start gap-3 -text-m1 font-normal leading-snug text-stone-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
              >
                <ClipboardIcon
                  width={24}
                  className="mt-1 text-fog-dark"
                />{" "}
                Desk, Examination, or Review Copy Requests
              </Link>
            </div>
          </div>

          <div className="md:order-first md:w-1/3">
            <div className="hidden md:block">
              <BookPageImage node={node} />
            </div>

            {hasExcerptAndMore && (
              <Link
                href={`${node.path}/excerpts`}
                className="group rs-py-1 rs-mt-2 rs-px-2 mx-auto flex w-fit items-center justify-center gap-5 border-2 border-press-sand font-normal text-stone-dark no-underline hocus:border-cardinal-red hocus:bg-cardinal-red hocus:text-white hocus:underline md:mt-0"
              >
                <span>Excerpts + more</span>
                <DocumentDuplicateIcon
                  width={28}
                  className="text-stone group-hocus:text-white"
                />
              </Link>
            )}
          </div>
        </div>
      </>

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
          <ul className="list-unstyled flex flex-col md:flex-row md:flex-wrap">
            {node.supBookSubjects.map(subject => {
              const linkParamsString = createLinkParams(subject)
              return (
                <li
                  key={subject.id}
                  className="min-w-fit flex-1"
                >
                  <a
                    href={`/search?${linkParamsString}`}
                    className="-text-m1 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
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
export default BookPage