import LegacyBookPage from "../title/page"

const Page = async ({searchParams}: {searchParams?: {[_key: string]: string}}) => {
  return <LegacyBookPage searchParams={searchParams} />
}

export default Page
