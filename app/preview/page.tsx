import {notFound} from "next/navigation"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import Page from "../page"
import {Suspense} from "react"

const PreviewPage = async () => {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  )
}

const Preview = async () => {
  if (!(await isPreviewMode())) notFound()
  return <Page />
}

export default PreviewPage
