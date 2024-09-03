import {getPathFromContext, PageProps} from "@lib/drupal/utils"
import FlushCache from "@components/elements/flush-cache"

const Layout = ({children, params}: PageProps & {children: React.ReactNode}) => {
  const currentPath = getPathFromContext({params})
  return (
    <>
      {process.env.VERCEL_ENV !== "production" && <FlushCache currentPath={currentPath} />}
      {children}
    </>
  )
}
export default Layout
