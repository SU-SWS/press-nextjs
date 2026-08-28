import Editori11y from "@components/tools/editorially"
import UnpublishedBanner from "@components/elements/unpublished-banner"
import {ReactNode} from "react"

const Layout = async ({children}: {children: ReactNode}) => {
  return (
    <UnpublishedBanner status={false} message="Preview Mode">
      <Editori11y />

      {children}
    </UnpublishedBanner>
  )
}
export default Layout
