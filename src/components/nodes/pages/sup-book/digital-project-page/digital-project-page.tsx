import {NodeSupBook, TermSupBookSubject} from "@lib/gql/__generated__/graphql"
import {H1, H2, H3} from "@components/elements/headers"
import {HTMLAttributes, Suspense} from "react"
import {Tab, TabPanel, Tabs, TabsList} from "@components/elements/tabs"
import Wysiwyg, {formatHtml} from "@components/elements/wysiwyg"
import {ArrowLongLeftIcon, ArrowRightIcon, BookmarkIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import BookAwards from "@components/nodes/pages/sup-book/book-awards"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import Button from "@components/elements/button"
import ExcerptButton from "@components/elements/excerpt-button"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const DigitalProjectPage = async ({node, ...props}: Props) => {
  const awards = node.supBookAwards?.sort((a, b) =>
    a.supYear && b.supYear && a.supYear < b.supYear
      ? 1
      : a.supYear === b.supYear && a.supRank && b.supRank && a.supRank > b.supRank
        ? -1
        : -1
  )

  const createLinkParams = (subject: TermSupBookSubject) => {
    const linkParams = new URLSearchParams({"only-books": "false", subjects: subject.name})

    if (subject.parent?.name) {
      linkParams.set("subjects", subject.parent.name)
      linkParams.set("q", subject.name)
    }
    return linkParams.toString()
  }

  return (
    <article {...props} className="centered">
      <NodePageMetadata metatags={node.metatag} pageTitle={node.title} backupDescription={node.supBookSubtitle}>
        {node.supBookAuthors?.map(author => (
          <>
            <meta property="book:author:profile:first_name" content={author.given || undefined} />
            <meta property="book:author:profile:last_name" content={author.family || undefined} />
          </>
        ))}
      </NodePageMetadata>
      <div className="mb-50 flex flex-col md:rs-mt-4 md:flex-row md:gap-80 lg:gap-[7.6rem]">
        <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col justify-center bg-fog-light px-50 md:hidden">
          <div className="flex flex-row gap-60">
            <div className="mb-40 hidden w-8/12 flex-col sm:flex md:hidden">
              <H1 className="mb-0 type-2 xl:text-[3.3rem]">{formatHtml(node.title)}</H1>

              {node.supBookSubtitle && (
                <div className="mt-12.5 type-0 font-medium xl:text-21">{formatHtml(node.supBookSubtitle)}</div>
              )}

              {node.supBookAuthorsFull && (
                <div className="mt-12.5 type-1 text-press-sand-dark xl:text-26">{node.supBookAuthorsFull}</div>
              )}
            </div>
            <div className="order-first w-full">
              <BookPageImage node={node} />
            </div>
          </div>
          <div className="order-first py-20 sm:pt-40 sm:pb-70">
            <Link
              href="/books"
              className="group flex w-fit items-center gap-12.5 font-normal text-stone-dark no-underline md:gap-15 hocus:text-archway-dark hocus:underline"
            >
              <ArrowLongLeftIcon
                width={25}
                className="text-stone-dark transition-all group-hocus:-translate-x-5 group-hocus:text-archway-dark"
              />
              <span className="text-18">Back to Books</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between md:w-[78%] md:gap-80 lg:flex-row lg:gap-[7.6rem]">
          <div className="2xl:w-full">
            <div className="rs-mb-0 flex flex-col border-b-2 border-fog rs-pb-3">
              <div className="mt-17.5 flex flex-col sm:mt-0 sm:hidden md:flex">
                <H1 className="mb-0 type-2 xl:text-[3.3rem]">{formatHtml(node.title)}</H1>

                {node.supBookSubtitle && (
                  <div className="mt-12.5 type-0 font-medium xl:text-21">{formatHtml(node.supBookSubtitle)}</div>
                )}

                {node.supBookAuthorsFull && (
                  <div className="mt-12.5 type-0 text-press-sand-dark xl:text-21">{node.supBookAuthorsFull}</div>
                )}
              </div>

              {awards && (
                <div className="rs-mt-1 border-t-2 border-fog">
                  <H2 className="flex w-fit items-center gap-5 bg-fog p-7.5 text-18 font-semibold">
                    <BookmarkIcon width={20} className="fill-archway" />
                    Award Winner
                  </H2>
                  <BookAwards>
                    {awards.map(award => (
                      <div key={award.uuid}>
                        <H3 className="type-0 xl:text-21">
                          {award.supYear}: {award.title}
                        </H3>
                        <Wysiwyg html={award.supDescription?.processed} className="ml-25" />
                      </div>
                    ))}
                  </BookAwards>
                </div>
              )}
            </div>

            <div className="rs-mb-0 flex flex-col gap-5 border-b-2 border-fog rs-pb-3">
              {node.supBookImprint && (
                <div className="rs-mb-0 text-18 font-semibold text-press-sand-dark">
                  Imprint: {node.supBookImprint.name}
                </div>
              )}

              {node.supBookCopublisherName && <div className="text-press-sand-dark">{node.supBookCopublisherName}</div>}

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
                    href={
                      node.supBookSeries.supSeriesPage?.url || `/search?q=${node.supBookSeries.name}&only-books=false`
                    }
                    className="text-18 font-normal text-stone-dark"
                  >
                    {node.supBookSeries.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="rs-mb-2 flex flex-col gap-12.5">
              <Link
                href="/digital"
                className="w-fit text-18 leading-snug font-normal text-stone-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
              >
                A Stanford Digital Project
              </Link>
              {node.supBookIsbn13Isw && <div className="text-18 text-stone-dark">ISBN: {node.supBookIsbn13Isw}</div>}
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

          <div className="xl:min-w-[200px] 2xl:max-w-[370px] 2xl:min-w-[320px]">
            {node.supBookUrlIsw && (
              <Button
                href={node.supBookUrlIsw.startsWith("http") ? node.supBookUrlIsw : "https://" + node.supBookUrlIsw}
                className="group flex w-full items-center justify-center gap-5"
              >
                Start Exploring
                <ArrowRightIcon width={24} className="transition-all group-hocus:translate-x-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="md:order-first md:w-1/4">
          <div className="hidden md:block">
            <BookPageImage node={node} />
          </div>
          <ExcerptButton id={node.uuid} path={node.path || "#"} />
        </div>
      </div>

      {(node.body?.processed || node.supBookReviews || node.supBookAuthorInfo) && (
        <Suspense>
          <Tabs
            className="mb-50 border-b border-fog pb-50"
            queryKey="tab"
            defaultValue={node.body?.processed ? "description" : node.supBookReviews ? "reviews" : "author"}
          >
            <div className="mb-50 border-b border-fog">
              <TabsList className="mx-auto max-w-5xl">
                {node.body?.processed && (
                  <Tab className="p-25" value="description">
                    Description
                  </Tab>
                )}
                {node.supBookReviews && (
                  <Tab className="p-25" value="reviews">
                    Reviews
                  </Tab>
                )}
                {node.supBookAuthorInfo && (
                  <Tab className="p-25" value="author">
                    About the Author
                  </Tab>
                )}
              </TabsList>
            </div>
            <div className="mx-auto max-w-5xl">
              {node.body?.processed && (
                <TabPanel value="description">
                  <Wysiwyg html={node.body?.processed} />
                </TabPanel>
              )}
              {node.supBookReviews && (
                <TabPanel value="reviews">
                  <Wysiwyg html={node.supBookReviews.processed} />
                </TabPanel>
              )}
              {node.supBookAuthorInfo && (
                <TabPanel value="author">
                  <Wysiwyg html={node.supBookAuthorInfo.processed} />
                </TabPanel>
              )}
            </div>
          </Tabs>
        </Suspense>
      )}

      {node.supBookSubjects && (
        <div className="mx-auto max-w-5xl">
          <H2 className="type-0 font-bold xl:text-21">Related Subjects</H2>
          <ul className="list-unstyled flex flex-col md:flex-row md:flex-wrap">
            {node.supBookSubjects.map(subject => (
              <li key={subject.uuid} className="min-w-fit flex-1">
                <Link
                  href={`/search?${createLinkParams(subject)}`}
                  className="text-18 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
                >
                  {subject.parent?.name && `${subject.parent.name} / `}
                  {subject.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
export default DigitalProjectPage
