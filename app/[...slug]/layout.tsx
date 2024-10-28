import {getPathFromContext, PageProps} from "@lib/drupal/utils"
import FlushCache from "@components/elements/flush-cache"
import {ReactNode} from "react"

type Props = Omit<PageProps, "searchParams"> & {
  children: ReactNode
}

const Layout = async (props: Props) => {
  const params = await props.params
  const path = getPathFromContext(params.slug)
  const {children} = props

  return (
    <>
      {process.env.VERCEL_ENV !== "production" && <FlushCache currentPath={path} />}
      {children}
    </>
  )
}
export default Layout
