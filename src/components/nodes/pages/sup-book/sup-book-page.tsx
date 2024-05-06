import {NodeSupBook} from "@lib/gql/__generated__/drupal";
import {H1, H2} from "@components/elements/headers";
import {HTMLAttributes} from "react";
import Image from "next/image";
import {Tab, TabPanel, Tabs, TabsList} from "@components/elements/tabs";
import Wysiwyg from "@components/elements/wysiwyg";
import BookPrecart from "@components/nodes/pages/sup-book/book-precart";
import {formatCurrency} from "@lib/utils/format-currency";
import {BookmarkIcon, BookOpenIcon, ClipboardIcon} from "@heroicons/react/24/outline";
import Link from "@components/elements/link";
import {getPlaceholderImage} from "@lib/utils/placeholder-image";
import LoadMoreList from "@components/elements/load-more-list";

type Props = HTMLAttributes<HTMLElement> & {
  node: NodeSupBook
}
const SupBookPage = async ({node, ...props}: Props) => {
  const lowestPrice = Math.min(node.supBookClothSalePrice || 9999, node.supBookPaperSalePrice || 9999, node.supBookPriceCloth || 9999, node.supBookPriceDigital || 9999, node.supBookPricePaper || 9999)
  const placeholderImage = node.supBookImage?.mediaImage.url && await getPlaceholderImage(node.supBookImage.mediaImage.url)

  const awards = node.supBookAwards?.sort((a, b) => a.supRank && b.supRank && a.supRank < b.supRank ? -1 : 1);

  return (
    <article className="centered pt-32" {...props}>
      <div className="flex flex-col lg:flex-row gap-20 mb-20">
        <div className="lg:w-2/3 flex flex-col lg:flex-row  gap-20">
          <div className="lg:w-1/2">
            <div className="flex flex-col gap-10 border-b border-black-20 pb-20 mb-20">
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

              {awards &&
                <div className="">
                  <H2 className="flex items-center bg-fog p-3 w-fit gap-2 -text-m1 font-semibold">
                    <BookmarkIcon width={20} className="fill-archway"/>
                    Award Winner
                  </H2>

                  <LoadMoreList itemsPerPage={3} ulProps={{className: "list-unstyled"}}>
                    {awards.map(award =>
                      <div key={award.id}>
                        {award.name}
                      </div>
                    )}
                  </LoadMoreList>
                </div>
              }

            </div>

            <div className="flex flex-col gap-2 border-b border-black-20 pb-20 mb-20">
              {node.supBookImprint &&
                <div className="font-semibold">Imprint: {node.supBookImprint.name}</div>
              }

              {node.supBookCopublisherName &&
                <div>{node.supBookCopublisherName}</div>
              }

              {node.supBookPubDateCloth?.time &&
                <div>{new Date(node.supBookPubDateCloth.time).toLocaleDateString("en-us", {
                  month: "long",
                  year: "numeric"
                })}</div>
              }

              {node.supBookPages &&
                <div>{node.supBookPages} Pages</div>
              }

              {lowestPrice &&
                <div>From {formatCurrency(lowestPrice)}</div>
              }

              {node.supBookSeries?.name &&
                <div>Series<br/>{node.supBookSeries?.name}</div>
              }
            </div>

            {node.supBookIsbn13Cloth &&
              <div>
                Hardcover ISBN: {node.supBookIsbn13Cloth}
              </div>
            }
            {node.supBookIsbn13Paper &&
              <div>
                Paperback ISBN: {node.supBookIsbn13Paper}
              </div>
            }
            {node.supBookIsbn13Digital &&
              <div>
                Ebook ISBN: {node.supBookIsbn13Digital}
              </div>
            }
          </div>

          <div className="order-first lg:w-1/2">
            {node.supBookImage?.mediaImage &&
              <div className="relative">
                <Image
                  src={node.supBookImage.mediaImage.url}
                  alt={node.supBookImage.mediaImage.alt || ""}
                  height={node.supBookImage.mediaImage.height}
                  width={node.supBookImage.mediaImage.width}
                  placeholder={placeholderImage ? "blur" : undefined}
                  blurDataURL={placeholderImage}
                  loading="eager"
                />
              </div>
            }

            {node.supBookExcerpts &&
              <Link href={`${node.path}/excerpts`} className="flex justify-center items-center gap-3">
                <BookOpenIcon width={20}/> Excerpts + more
              </Link>
            }
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="border-b border-black-20 mb-10 pb-10">
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

          <div className="border-b border-black-20 mb-10 pb-10">
            Also Available from<br/>
            .... need to figure this part out.
            <ul className="list-unstyled">
              <li><a href="https://www.barnesandnoble.com/b/nook-devices">Barnes and Noble Nook</a></li>
              <li><a href="https://play.google.com/store/books/details">Google Play</a></li>
              <li><a href="https://www.amazon.com/dp">Amazon Kindle</a></li>
              <li><a href="https://itunes.apple.com/us/book/">Apple Books</a></li>
            </ul>
          </div>

          <Link href={node.path + "/desk-examination-copy-requests"} className="flex items-center gap-3">
            <ClipboardIcon width={20}/> Desk, Examination, or Review Copy Requests
          </Link>
        </div>

      </div>


      <Tabs>
        <div className="border-b border-black-20 mb-20">
          <TabsList className="max-w-5xl mx-auto">
            {node.supBookDescription?.processed &&
              <Tab>
                Description
              </Tab>
            }
            {node.supBookReviews &&
              <Tab>
                Reviews
              </Tab>
            }
            {node.supBookAuthorInfo &&
              <Tab>
                About the Author
              </Tab>
            }
          </TabsList>
        </div>
        <div className="max-w-5xl mx-auto">
          {node.supBookDescription?.processed &&
            <TabPanel>
              <Wysiwyg html={node.supBookDescription?.processed}/>
            </TabPanel>
          }
          {node.supBookReviews &&
            <TabPanel>
              <Wysiwyg html={node.supBookReviews.processed}/>
            </TabPanel>
          }
          {node.supBookAuthorInfo &&
            <TabPanel>
              <Wysiwyg html={node.supBookAuthorInfo.processed}/>
            </TabPanel>
          }
        </div>
      </Tabs>
    </article>
  )
}
export default SupBookPage;