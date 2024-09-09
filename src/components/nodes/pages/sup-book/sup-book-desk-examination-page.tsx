import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {H1, H2, H3} from "@components/elements/headers"
import {HTMLAttributes} from "react"
import Link from "@components/elements/link"
import BackToLink from "@components/elements/back-to-link"
import {twMerge} from "tailwind-merge"
import BookPageImage from "./book-page-image"

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookDeskExaminationPage = ({node, ...props}: Props) => {
  const isbn = node.supBookIsbn13Paper || node.supBookIsbn13Cloth
  const hyphenTitle = node.title.replace(/ /, "-").replace(/[^\w-]/, "")

  return (
    <BackToLink
      {...props}
      className={twMerge("centered", props.className)}
      href={node.path}
      title={node.title}
      childrenProps={{className: "rs-mt-4 mx-auto max-w-[800px]"}}
      isArticle
    >
      <H1>
        Desk, Examination, or Review copy request<span className="sr-only">&nbps;{node.title}</span>
      </H1>
      <div className="rs-mb-0 flex flex-col md:flex-row">
        <div className="flex flex-col md:rs-ml-1">
          <div className="type-2 font-medium">{node.title}</div>

          {node.supBookSubtitle && <div className="type-1 mt-5 font-medium">{node.supBookSubtitle}</div>}

          {node.supBookAuthorsFull && <div className="type-0 mt-5 text-press-sand-dark">{node.supBookAuthorsFull}</div>}
        </div>

        {node.supBookImage?.mediaImage && (
          <div className="relative order-first w-full max-w-[16rem] shrink-0">
            <BookPageImage node={node} />
          </div>
        )}
      </div>

      <div>
        {node.supBookAvailDesc && (
          <div className="type-0 mb-16 font-semibold text-archway-dark">{node.supBookAvailDesc}</div>
        )}

        <H2 className="rs-mt-4 type-1">Request Types</H2>
        <ul className="rs-mb-2">
          <li>
            <b>Review copies</b> are for media who plan to give the book to a reviewer.
          </li>
          <li>
            <b>Desk copies</b> are for instructors who have adopted the book for a class and meet our{" "}
            <Link href="/requests/?item=deskcopy">desk copy requirements.</Link>
          </li>
          <li>
            <b>Examination copies</b> are for instructors who are considering using a text but have not adopted it.
          </li>
        </ul>

        <H2 className="rs-mt-4 type-1">Review Copy Requests</H2>
        <p>
          If you would like to review one of our titles for a periodical or other publication, please email{" "}
          <Link href="mailto:publicity@www.sup.org">publicity@www.sup.org</Link> with the following information:
        </p>

        <ul className="rs-mb-2">
          <li>Name, publication</li>
          <li>Name and author requested book</li>
          <li>Do you require a print or ebook? Please note we prefer to provide ebooks whenever possible.</li>
          <li>Mailing address (if a print book is requested)</li>
        </ul>

        <p className="my-5 border-l-3 border-fog pl-5">
          Please note that submissions from individuals or professors requiring a desk or examination copy cannot be
          approved though this method.
        </p>

        {node.supBookDigitalCompLink && (
          <>
            <H2 className="rs-mt-4 type-1">Desk and Examination Copies—Digital</H2>
            <p>
              Please scroll to <span className="font-semibold">Desk and Examination Copies—Print</span> at the end of
              this page if you are looking for a print copy.
            </p>

            <H3>Select Type of Request</H3>
            <ul className="rs-mb-2">
              <li>
                If you are{" "}
                <b>
                  <Link href={`http://sup.ereviews.eb20.com/Requests/EReview/${node.supBookIsbn13Digital}`}>
                    a periodical or other publication reviewing our content.
                  </Link>
                </b>
                <br />
                &nbsp;&nbsp;&nbsp;(Submissions from individuals not accepted.)
              </li>
              <li>
                If you are{" "}
                <b>
                  <Link href={`http://sup.einspections.eb20.com/Requests/EInspection/${node.supBookIsbn13Digital}`}>
                    a professor requesting a desk copy or an examination copy.
                  </Link>
                </b>{" "}
                <br />
                &nbsp;&nbsp;&nbsp;(Details of the course you are teaching must be provided.)
              </li>
            </ul>

            <ol className="rs-mb-2">
              <li>
                New users click &quot;Request Access.&quot; Returning users log in with email address and password.
              </li>
              <li>
                Follow the instructions to submit your request. Please note the details of the course you are teaching
                must be provided.
              </li>
              <li>
                Once your request for a digital copy has been approved, you will receive log-in details for your own
                personal electronic bookshelf.
              </li>
            </ol>
            <p>
              Please be advised that it may take up to two weeks for requests to be reviewed, and that all requests will
              be addressed in the order in which they are received.
            </p>

            <H3>From your electronic bookshelf you will be able to:</H3>
            <ul className="rs-mb-2">
              <li>download and read the textbooks you have requested within 60 days</li>
              <li>submit feedback</li>
              <li>request an extension</li>
              <li>request further books</li>
            </ul>

            <p>
              For help accessing your ebook check the{" "}
              <b>
                <Link href="http://sup.einspections.eb20.com/Help/">digital comps website help</Link>
              </b>{" "}
              first. If that does not answer your question(s), please contact us at{" "}
              <Link href="mailto:information@www.sup.org">information@www.sup.org</Link>.
            </p>
            <p>
              If you are requesting a book on behalf of someone else, enter in the name and email of the individual for
              whom the digital comp is intended for instead of your own as it will be locked to this email address.
            </p>
            <hr />

            {node.supBookPrintDeskCopies && (
              <>
                <H3>Print Copy</H3>
                <p>
                  Please{" "}
                  <b>
                    <Link href={`http://ingramacademic.com/${isbn}/${hyphenTitle}/`}>follow this link</Link>
                  </b>{" "}
                  to request a print Exam or Desk copy for a small fee.
                </p>
              </>
            )}

            {!node.supBookPrintDeskCopies && (
              <>
                <H2 className="rs-mt-4 type-1">Digital Only</H2>
                <p>This title is only available as a digital copy.</p>
              </>
            )}
          </>
        )}

        {!node.supBookDigitalCompLink && (
          <>
            {node.supBookPrintDeskCopies && (
              <>
                <H3>Print Copy</H3>
                <p>
                  Please{" "}
                  <b>
                    <Link href={`http://ingramacademic.com/${isbn}/${hyphenTitle}/`}>follow this link</Link>
                  </b>{" "}
                  to request a print Exam or Desk copy for a small fee.
                </p>
              </>
            )}

            {!node.supBookPrintDeskCopies && (
              <>
                <H3>Digital Only</H3>
                <p>This title is only available as a digital copy.</p>
              </>
            )}
          </>
        )}
      </div>
    </BackToLink>
  )
}

export default SupBookDeskExaminationPage
