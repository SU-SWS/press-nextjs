import {NodeSupBook} from "@lib/gql/__generated__/drupal";
import {H1, H2, H3} from "@components/elements/headers";
import {HTMLAttributes} from "react";
import Link from "@components/elements/link";
import Image from "next/image";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}

const SupBookDeskExaminationPage = ({node, ...props}: Props) => {
  const isbn = node.supBookIsbn13Paper || node.supBookIsbn13Cloth
  const hyphenTitle = node.title.replace(/ /, "-").replace(/[^\w-]/, "")

  return (
    <div className="centered flex flex-col gap-10">
      <article className="max-w-[900px] mx-auto pt-32 order-last" {...props}>
        <H1 className="font-medium mb-32">
          Desk, Examination, or Review copy request
        </H1>
        <div className="flex flex-col md:flex-row gap-20 mb-36">

          <div className="flex flex-col gap-10">
            <div className="font-medium text-stone-dark text-m4">
              {node.title}
            </div>

            {node.supBookSubtitle &&
              <div className="font-medium text-stone-dark text-m3">{node.supBookSubtitle}</div>
            }

            {node.supBookAuthorsFull &&
              <div className="text-stone text-m2">{node.supBookAuthorsFull}</div>
            }
          </div>

          {node.supBookImage?.mediaImage &&
            <div className="relative order-first w-full md:w-1/3 shrink-0">
              <Image
                src={node.supBookImage.mediaImage.url}
                alt={node.supBookImage.mediaImage.alt || ""}
                height={node.supBookImage.mediaImage.height}
                width={node.supBookImage.mediaImage.width}
              />
            </div>
          }
        </div>

        <div>
          {node.supBookAvailDesc &&
            <div className="text-archway-dark font-semibold text-m1 mb-16">{node.supBookAvailDesc}</div>
          }

          <H2>Request Types</H2>
          <ul>
            <li><b>Review copies</b> are for media who plan to give the book to a reviewer.</li>
            <li><b>Desk copies</b> are for instructors who have adopted the book for a class and meet our <a
              href="/requests/?item=deskcopy">desk copy requirements.</a></li>
            <li><b>Examination copies</b> are for instructors who are considering using a text but have not adopted it.
            </li>
          </ul>


          <H2>Review Copy Requests</H2>
          <p>If you would like to review one of our titles for a periodical or other publication, please email <a
            href="mailto:publicity@www.sup.org">publicity@www.sup.org</a> with the following information:
          </p>

          <ul>
            <li>Name, publication</li>
            <li>Name and author requested book</li>
            <li>Do you require a print or ebook? Please note we prefer to provide ebooks whenever possible.</li>
            <li>Mailing address (if a print book is requested)</li>
          </ul>

          <p className="italic">
            Please note that submissions from individuals or professors requiring a desk or examination copy cannot be
            approved though this method.
          </p>

          {node.supBookDigitalCompLink &&
            <>
              <H2>Desk and Examination Copies—Digital</H2>
              <p>
                Please scroll to <span className="font-semibold">Desk and Examination Copies—Print</span> at the end
                of
                this page if you are looking for a print copy.
              </p>

              <H3>Select Type of Request</H3>
              <ul>
                <li>
                  If you are <b><a href={`http://sup.ereviews.eb20.com/Requests/EReview/${node.supBookIsbn13Digital}`}>a
                  periodical or
                  other publication reviewing our content.</a></b><br/>&nbsp;&nbsp;&nbsp;(Submissions from individuals
                  not
                  accepted.)
                </li>
                <li>
                  If you are <b><a
                  href={`http://sup.einspections.eb20.com/Requests/EInspection/${node.supBookIsbn13Digital}`}>a
                  professor
                  requesting a desk copy or an examination copy.</a></b> <br/>&nbsp;&nbsp;&nbsp;(Details of the course
                  you
                  are teaching must be provided.)
                </li>
              </ul>

              <ol>
                <li>New users click &quot;Request Access.&quot; Returning users log in with email address and
                  password.
                </li>
                <li>Follow the instructions to submit your request. Please note the details of the course you are
                  teaching
                  must be provided.
                </li>
                <li>Once your request for a digital copy has been approved, you will receive log-in details for your own
                  personal electronic bookshelf.
                </li>
              </ol>
              <p>
                Please be advised that it may take up to two weeks for requests to be reviewed,
                and that all requests will be addressed in the order in which they are received.
              </p>

              <H3>From your electronic bookshelf you will be able to:</H3>
              <ul>
                <li>download and read the textbooks you have requested within 60 days</li>
                <li>submit feedback</li>
                <li>request an extension</li>
                <li>request further books</li>
              </ul>

              <p>
                For help accessing your ebook check the <b><a href="http://sup.einspections.eb20.com/Help/">digital
                comps
                website help</a></b> first. If that does not answer your question(s), please contact us at <a
                href="mailto:information@www.sup.org">information@www.sup.org</a>.
              </p>
              <p>
                If you are requesting a book on behalf of someone else, enter in the name and email of the individual
                for
                whom the digital comp is intended for instead of your own as it will be locked to this email address.
              </p>
              <hr/>


              {node.supBookPrintDeskCopies &&
                <>
                  <H3>Print Copy</H3>
                  <p>
                    Please <b><a href={`http://ingramacademic.com/${isbn}/${hyphenTitle}/`}>follow this link</a></b> to
                    request a
                    print Exam or Desk copy for a small fee.
                  </p>
                </>
              }

              {!node.supBookPrintDeskCopies &&
                <>
                  <H2>Digital Only</H2>
                  <p>This title is only available as a digital copy.</p>
                </>
              }
            </>
          }

          {!node.supBookDigitalCompLink &&
            <>
              {node.supBookPrintDeskCopies &&
                <>
                  <H3>Print Copy</H3>
                  <p>Please <b><a href={`http://ingramacademic.com/${isbn}/${hyphenTitle}/`}>follow this link</a></b> to
                    request a print Exam or Desk copy for a small fee.</p>
                </>
              }

              {!node.supBookPrintDeskCopies &&
                <>
                  <H3>Digital Only</H3>
                  <p>This title is only available as a digital copy.</p>
                </>
              }
            </>
          }
        </div>
      </article>

      <Link href={node.path} className="pt-20 flex items-center gap-5 w-fit">
        <ArrowLeftIcon width={20} className="text-fog-dark"/>
        <span className="text-stone-dark">Back to {node.title}</span>
      </Link>
    </div>
  )
}

export default SupBookDeskExaminationPage;