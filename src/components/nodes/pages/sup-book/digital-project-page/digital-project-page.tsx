import {NodeSupBook, TermSupBookSubject} from "@lib/gql/__generated__/drupal"
import {H1, H2, H3} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import {Tab, TabPanel, Tabs, TabsList} from "@components/elements/tabs"
import Wysiwyg from "@components/elements/wysiwyg"
import {ArrowLongLeftIcon, ArrowRightIcon, BookmarkIcon, DocumentDuplicateIcon} from "@heroicons/react/24/outline"
import Link from "@components/elements/link"
import BookAwards from "@components/nodes/pages/sup-book/book-awards"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import BookPageImage from "@components/nodes/pages/sup-book/book-page-image"
import Button from "@components/elements/button"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const DigitalProjectPage = async ({node, ...props}: Props) => {
  const hasExcerptAndMore =
    node.supBookExcerpts || node.supBookTableOfContents || !!(await getBookAncillaryContents(node.id, node.path)).length
  const awards = node.supBookAwards?.sort((a, b) =>
    a.supYear < b.supYear ? 1 : a.supYear === b.supYear && a.supRank && b.supRank && a.supRank > b.supRank ? -1 : -1
  )

  const createLinkParams = (subject: TermSupBookSubject) => {
    const linkParams = new URLSearchParams({"only-books": "false", subjects: subject.name})

    if (subject.parent?.name) {
      linkParams.set("subjects", subject.parent.name)
      linkParams.set("q", subject.name)
    }
    return linkParams.toString()
  }

  const bookSubjectLinkParams = node.supBookSubjects && createLinkParams(node.supBookSubjects[0])

  return (
    <article {...props} className="centered">
      <div className="mb-20 flex flex-col md:rs-mt-4 md:flex-row md:gap-32 lg:gap-[7.6rem]">
        <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col justify-center bg-fog-light px-20 md:hidden">
          <div className="flex flex-row gap-24">
            <div className="mb-16 hidden w-8/12 flex-col sm:flex md:hidden">
              <H1 className="type-2 mb-0 xl:text-[3.3rem]">{node.title}</H1>

              {node.supBookSubjects && (
                <Link
                  prefetch={false}
                  href={`/search?${bookSubjectLinkParams}`}
                  className="rs-mb-2 order-first text-18 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
                >
                  {node.supBookSubjects[0].parent?.name || node.supBookSubjects[0].name}
                </Link>
              )}

              {node.supBookSubtitle && <div className="type-0 mt-5 font-medium xl:text-21">{node.supBookSubtitle}</div>}

              {node.supBookAuthorsFull && (
                <div className="type-1 mt-5 text-press-sand-dark xl:text-26">{node.supBookAuthorsFull}</div>
              )}
            </div>
            <div className="order-first w-full">
              <BookPageImage node={node} />
            </div>
          </div>
          <div className="order-first py-8 sm:pb-28 sm:pt-16">
            <Link
              href="/books"
              className="group flex w-fit items-center gap-5 font-normal text-stone-dark no-underline hocus:text-archway-dark hocus:underline md:gap-6"
            >
              <ArrowLongLeftIcon width={25} className="text-stone-dark group-hocus:text-archway-dark" />
              <span className="text-18">Back to Books</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between md:w-[78%] md:gap-32 lg:flex-row lg:gap-[7.6rem]">
          <div className="lg:w-5/8 2xl:w-full">
            <div className="rs-mb-0 rs-pb-3 flex flex-col border-b-2 border-fog">
              <div className="mt-7 flex flex-col sm:mt-0 sm:hidden md:flex">
                <H1 className="type-2 mb-0 xl:text-[3.3rem]">{node.title}</H1>

                {node.supBookSubjects && (
                  <Link
                    prefetch={false}
                    href={`/search?${bookSubjectLinkParams}`}
                    className="rs-mb-2 order-first text-18 font-normal text-stone-dark decoration-fog-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
                  >
                    {node.supBookSubjects[0].parent?.name || node.supBookSubjects[0].name}
                  </Link>
                )}

                {node.supBookSubtitle && (
                  <div className="type-0 mt-5 font-medium xl:text-21">{node.supBookSubtitle}</div>
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
                          {award.supYear}: {award.name}
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
                <div>
                  Series
                  <br />
                  <Link
                    prefetch={false}
                    href={`/search?q=${node.supBookSeries.name}&only-books=false`}
                    className="text-18 font-normal text-stone-dark"
                  >
                    {node.supBookSeries.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="rs-mb-2 flex flex-col gap-5">
              <Link
                href="/digital"
                className="w-fit text-18 font-normal leading-snug text-stone-dark underline-offset-[5px] hocus:text-archway-dark hocus:decoration-archway-dark hocus:decoration-2"
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

          <div className="lg:w-3/8 xl:min-w-[200px] 2xl:min-w-[320px] 2xl:max-w-[370px]">
            {node.supBookUrlIsw && (
              <Button
                href={node.supBookUrlIsw.startsWith("http") ? node.supBookUrlIsw : "https://" + node.supBookUrlIsw}
                className="flex w-full items-center justify-center gap-2"
              >
                Start Exploring
                <ArrowRightIcon width={24} />
              </Button>
            )}

            {node.supBookERetailers && (
              <div className="rs-mb-1 rs-pb-1 border-b-2 border-fog text-18">
                <H2 className="text-18">Also Available from</H2>
                <ul className="list-unstyled rs-mt-0 flex flex-col gap-3 [&_a]:font-normal [&_a]:text-digital-red">
                  {node.supBookERetailers.map((link, i) => (
                    <li key={`e-book-retailer-${i}`} className="mb-0">
                      <Link
                        prefetch={false}
                        href={link.url || "#"}
                        className="font-normal underline-offset-[5px] hocus:text-stone-dark hocus:decoration-archway-dark hocus:decoration-2"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {node.supBookERetailers && (
              <div className="rs-mb-1 rs-pb-1 border-b-2 border-fog text-18">
                <H2 className="text-18">Also Available from</H2>
                <ul className="list-unstyled rs-mt-0 flex flex-col gap-3 [&_a]:font-normal [&_a]:text-digital-red">
                  {node.supBookERetailers.map((link, i) => (
                    <li key={`e-book-retailer-${i}`} className="mb-0">
                      <Link
                        prefetch={false}
                        href={link.url || "#"}
                        className="font-normal underline-offset-[5px] hocus:text-stone-dark hocus:decoration-archway-dark hocus:decoration-2"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="md:order-first md:w-1/4">
          <div className="hidden md:block">
            <BookPageImage node={node} />
          </div>

          {hasExcerptAndMore && (
            <Link
              href={`${node.path}/excerpts`}
              className="group rs-mt-2 mx-auto flex w-fit items-center justify-center gap-5 border-2 border-press-sand p-[1.8rem] pl-[2.1rem] text-09em font-normal text-stone-dark no-underline hocus:border-cardinal-red hocus:bg-cardinal-red hocus:text-white hocus:underline md:mt-0"
            >
              <span>Excerpts + more</span>
              <DocumentDuplicateIcon width={28} className="text-stone group-hocus:text-white" />
            </Link>
          )}
        </div>
      </div>

      {(node.supBookDescription?.processed || node.supBookReviews || node.supBookAuthorInfo) && (
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
      )}

      {node.supBookSubjects && (
        <div className="mx-auto max-w-5xl">
          <H2 className="type-0 font-bold xl:text-21">Related Subjects</H2>
          <ul className="list-unstyled flex flex-col md:flex-row md:flex-wrap">
            {node.supBookSubjects.map(subject => (
              <li key={subject.id} className="min-w-fit flex-1">
                <Link
                  prefetch={false}
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
