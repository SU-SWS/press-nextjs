import {notFound} from "next/navigation"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import Page from "../page"

const PreviewPage = async () => {
  if (!(await isPreviewMode())) notFound()
  return <Page />
}

export default PreviewPage
