"use client"

import Link from "@components/elements/link"
import {DocumentDuplicateIcon} from "@heroicons/react/24/outline"
import {useEffect, useState} from "react"

type Props = {
  id: string
  path: string
}
const ExcerptButton = ({id, path}: Props) => {
  const [excerpts, setExcerpts] = useState([])
  useEffect(() => {
    fetch(`/api/books/excerpts/${id}`)
      .then(res => res.json())
      .then(data => setExcerpts(data))
      .catch(_e => console.warn("An error occurred fetching excerpt data"))
  }, [id, path])

  if (excerpts.length === 0) return

  return (
    <Link
      href={`${path}/excerpts`}
      className="group rs-mt-2 mx-auto flex w-fit items-center justify-center gap-5 border-2 border-press-sand p-[1.8rem] pl-[2.1rem] text-09em font-normal text-stone-dark no-underline hocus:border-cardinal-red hocus:bg-cardinal-red hocus:text-white hocus:underline md:mt-0"
    >
      <span>Excerpts + more</span>
      <DocumentDuplicateIcon width={28} className="text-stone group-hocus:text-white" />
    </Link>
  )
}
export default ExcerptButton
