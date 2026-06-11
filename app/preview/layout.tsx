import Editori11y from "@components/tools/editorially"
import UnpublishedBanner from "@components/elements/unpublished-banner"

const Layout = async ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <UnpublishedBanner status={false} message="Preview Mode">
        <Editori11y />
      </UnpublishedBanner>

      {children}
    </>
  )
}
export default Layout
