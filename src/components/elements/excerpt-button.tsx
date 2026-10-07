import Link from "@components/elements/link"
import {DocumentDuplicateIcon} from "@heroicons/react/24/outline"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"

type Props = {
  id: string
  path: string
}

/**
 * Link to the book's excerpts when it has any.
 *
 * Rendered on the server so the answer is part of the cached book page, instead of every page view fetching it from an
 * API route. The lookup is tagged `excerpts:<uuid>`, so saving an excerpt only re-renders that book's page.
 */
const ExcerptButton = async ({id, path}: Props) => {
  const excerpts = await getBookAncillaryContents(id)
  if (excerpts.length === 0) return

  return (
    <Link
      href={`${path}/excerpts`}
      className="group mx-auto rs-mt-2 flex w-fit items-center justify-center gap-12.5 border-2 border-press-sand p-[1.8rem] pl-[2.1rem] font-normal text-stone-dark no-underline md:mt-0 hocus:border-cardinal-red hocus:bg-cardinal-red hocus:text-white hocus:underline"
    >
      <span>Excerpts + more</span>
      <DocumentDuplicateIcon width={28} className="text-stone group-hocus:text-white" />
    </Link>
  )
}
export default ExcerptButton
