import {getPathFromContext, PageProps} from "@lib/drupal/utils"
import FlushCache from "@components/elements/flush-cache"
import {ReactNode} from "react"

type Props = Omit<PageProps, "searchParams"> & {
  children: ReactNode
}

const Layout = ({children, params}: Props) => {
  const currentPath = getPathFromContext({params})
  return (
    <>
      {process.env.VERCEL_ENV !== "production" && <FlushCache currentPath={currentPath} />}
      {children}
    </>
  )
}
export default Layout
