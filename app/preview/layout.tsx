import UnpublishedBanner from "@components/elements/unpublished-banner"
import {ReactNode, Suspense} from "react"
import PreviewTools from "./preview-tools"

const Layout = async ({children}: {children: ReactNode}) => {
  return (
    <UnpublishedBanner status={false} message="Preview Mode">
      <Suspense>
        <PreviewTools />
      </Suspense>

      {children}
    </UnpublishedBanner>
  )
}
export default Layout
