import {NodeSupBook, TermSupBookSubject} from "@lib/gql/__generated__/drupal.d"
import {H1, H2, H3} from "@components/elements/headers"
import {Fragment, HTMLAttributes} from "react"
import {Tab, TabPanel, Tabs, TabsList} from "@components/elements/tabs"
import Wysiwyg from "@components/elements/wysiwyg"
import {ArrowLongLeftIcon, BookmarkIcon, ClipboardIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import BookAwards from "@components/nodes/pages/sup-book/book-awards"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import PreCartClient from "@components/nodes/pages/sup-book/precart/precart.client"
import ExcerptButton from "@components/elements/excerpt-button"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const BookPage = async ({node, ...props}: Props) => {
  const awards = node.supBookAwards?.sort((a, b) =>
    a.supYear && b.supYear && a.supYear < b.supYear
      ? 1
      : a.supYear === b.supYear && a.supRank && b.supRank && a.supRank > b.supRank
        ? -1
        : -1
  )

  const createLinkParams = (subject: TermSupBookSubject) => {
    const linkParams = new URLSearchParams({subjects: subject.name})

    if (subject.parent?.name) {
      linkParams.set("subjects", subject.parent.name)
      linkParams.set("q", subject.name)
    }
    return linkParams.toString()
  }

  return (
    <article {...props} className="centered">
      <NodePageMetadata metatags={node.metatag} pageTitle={node.title} backupDescription={node.supBookSubtitle}>
        {node.supBookAuthors?.map((author, i) => (
          <Fragment key={`author-${i}`}>
            <meta property="book:author:profile:first_name" content={author.given || undefined} />
            <meta property="book:author:profile:last_name" content={author.family || undefined} />
          </Fragment>
        ))}
      </NodePageMetadata>
      <div className="mb-20 flex flex-col md:rs-mt-4 md:flex-row md:gap-32 lg:gap-[7.6rem]">
        <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col justify-center bg-fog-light px-20 md:hidden">
          <div className="flex flex-row gap-24">
            <div className="mb-16 hidden w-8/12 flex-col sm:flex md:hidden">
              <H1 className="type-2 mb-0 xl:text-[3.3rem]">{node.title}</H1>

              {node.supBookSubtitle && <div className="type-1 mt-5 font-medium xl:text-26">{node.supBookSubtitle}</div>}

              {node.supBookAuthorsFull && (
                <div className="type-1 mt-5 text-press-sand-dark xl:text-26">{node.supBookAuthorsFull}</div>
              )}
            </div>
            <div className="order-first sm:w-5/12">
              <BookPageImage node={node} />
            </div>
          </div>
          <div className="order-first py-8 sm:pb-28 sm:pt-16">
            <Link
              href="/books"
              className="group flex w-fit items-center gap-5 font-normal text-stone-dark no-underline hocus:text-archway-dark hocus:underline md:gap-6"
            >
              <ArrowLongLeftIcon
                width={25}
                className="text-stone-dark transition-all group-hocus:-translate-x-2 group-hocus:text-archway-dark"
              />
              <span className="text-18">Back to Books</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between md:w-[78%] md:gap-32 lg:flex-row lg:gap-[7.6rem]">
          <div className="lg:w-5/8 2xl:w-full">
            <div className="rs-mb-0 rs-pb-3 flex flex-col border-b-2 border-fog">
              <div className="mt-7 flex flex-col sm:mt-0 sm:hidden md:flex">
                <H1 className="type-2 mb-0 xl:text-[3.3rem]">{node.title}</H1>

                {node.supBookSubtitle && (
                  <div className="type-1 mt-5 font-medium xl:text-26">{node.supBookSubtitle}</div>
                )}

                {node.supBookAuthorsFull && (
                  <div className="type-0 mt-5 text-press-sand-dark xl:text-21">{node.supBookAuthorsFull}</div>
                )}
              </div>

              {awards && (
                <div className="rs-mt-1 border-t-2 border-fog">
                  <H2 className="flex w-fit items-center gap-2 bg-fog p-3 text-18 font-semibold">
                    <BookmarkIcon width={20} className="fill-archway" />
                    Award Winner
                  </H2>
                  <BookAwards>
                    {awards.map(award => (
                      <div key={award.id}>
                        <H3 className="type-0 xl:text-21">
                          {award.supYear}: {award.title}
                        </H3>
                        <Wysiwyg html={award.supDescription?.processed} className="ml-10" />
                      </div>
                    ))}
                  </BookAwards>
                </div>
              )}
            </div>

            <div className="rs-mb-0 rs-pb-3 flex flex-col gap-2 border-b-2 border-fog">
              {node.supBookImprint && (
                <div className="rs-mb-0 text-18 font-semibold text-press-sand-dark">
                  Imprint: {node.supBookImprint.name}
                </div>
              )}

              {node.supBookPublisher && (
                <div className="rs-pb-3 text-press-sand-dark">Published by {node.supBookPublisher}</div>
              )}
              {node.supBookCopublisherName && (
                <div className="rs-pb-3 text-press-sand-dark">{node.supBookCopublisherName}</div>
              )}

              {node.supBookPubDateCloth?.time && (
                <div className="text-18 text-press-sand-dark">
                  {new Date(node.supBookPubDateCloth.time).toLocaleDateString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}

              {!!node.supBookPages && <div className="text-18 text-press-sand-dark">{node.supBookPages} Pages</div>}

              {node.supBookSeries?.name && (
                <div className="rs-mt-0 text-18">
                  Series
                  <br />
                  <Link
                    prefetch={false}
                    href={node.supBookSeries.supSeriesPage?.url || `/search?q=${node.supBookSeries.name}`}
                    className="text-18 font-normal text-stone-dark"
                  >
                    {node.supBookSeries.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="rs-mb-2 flex flex-col gap-2">
              {node.supBookIsbn13Cloth && (
                <div className="text-18 text-stone-dark">Hardcover ISBN: {node.supBookIsbn13Cloth}</div>
              )}
              {node.supBookIsbn13Paper && (
                <div className="text-18 text-stone-dark">Paperback ISBN: {node.supBookIsbn13Paper}</div>
              )}
              {node.supBookIsbn13Digital && (
                <div className="text-18 text-stone-dark">Ebook ISBN: {node.supBookIsbn13Digital}</div>
              )}
            </div>
          </div>

          <div className="lg:w-3/8 xl:min-w-[200px] 2xl:min-w-[320px] 2xl:max-w-[370px]">
            {!node.supBookNoCart && (node.supBookIsbn13Cloth || node.supBookIsbn13Paper || node.supBookIsbn13Alt) && (
              <PreCartClient
                priceId={node.supBookPriceData?.id}
                bookTitle={node.title}
                clothIsbn={node.supBookIsbn13Cloth}
                paperIsbn={node.supBookIsbn13Paper}
                ebookIsbn={node.supBookIsbn13Digital}
                hasIntlCart={node.supBookPriceData?.supIntlCart}
                pdf={node.supBookPdfFormat}
                epub={node.supBookEpubFormat}
                firstPub={node.supBookPubDateFirst}
                altIsbn={node.supBookIsbn13Alt}
                altFormat={node.supBookAltFormat}
              />
            )}

            <Link
              href={node.path + "/desk-examination-copy-requests"}
              className="flex items-start gap-3 text-18 font-normal leading-snug text-stone-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
            >
              <ClipboardIcon width={24} className="mt-1 shrink-0 text-fog-dark" /> Desk, Examination, or Review Copy
              Requests
            </Link>
          </div>
        </div>

        <div className="md:order-first md:w-[22%]">
          <div className="hidden md:block">
            <BookPageImage node={node} />
          </div>

          <ExcerptButton id={node.id} path={node.path || "#"} />
        </div>
      </div>

      {(node.body?.processed || node.supBookReviews || node.supBookAuthorInfo) && (
        <Tabs className="mb-20 border-b border-fog pb-20">
          <div className="mb-20 border-b border-fog">
            <TabsList className="mx-auto max-w-5xl">
              {node.body?.processed && <Tab className="p-10">Description</Tab>}
              {node.supBookReviews && <Tab className="p-10">Reviews</Tab>}
              {node.supBookAuthorInfo && <Tab className="p-10">About the Author</Tab>}
            </TabsList>
          </div>
          <div className="mx-auto max-w-5xl">
            {node.body?.processed && (
              <TabPanel>
                <Wysiwyg html={node.body?.processed} />
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
      )}

      {node.supBookSubjects && (
        <div className="mx-auto max-w-5xl">
          <H2 className="type-0 font-bold xl:text-21">Related Subjects</H2>
          <ul className="list-unstyled flex flex-col gap-x-10 md:flex-row md:flex-wrap">
            {node.supBookSubjects.map(subject => {
              const linkParamsString = createLinkParams(subject)
              return (
                <li key={subject.id} className="min-w-fit">
                  <Link
                    prefetch={false}
                    href={`/search?${linkParamsString}`}
                    className="text-18 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
                  >
                    {subject.parent?.name && `${subject.parent.name} / `}
                    {subject.name}
                  </Link>
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
