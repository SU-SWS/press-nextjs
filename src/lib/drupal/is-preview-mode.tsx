import {cookies} from "next/headers"

/*
 * Draft mode works when in normal builds. Use environment variable during development.
 */
export const isPreviewMode = async (): Promise<boolean> => {
  return (
    process.env.NODE_ENV === "development" ||
    (await cookies())?.get("preview")?.value === process.env.DRUPAL_PREVIEW_SECRET
  )
}
