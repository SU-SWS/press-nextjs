import {getPlaiceholder} from "plaiceholder"
import {ImageProps} from "next/image"
import {cacheTag} from "next/cache"

type ReturnProps = {
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: ImageProps["blurDataURL"]
}

// The whole source image is pulled into memory before sharp runs on it, so a slow or oversized asset can hold a
// function open or exhaust its memory. Both are bounded here.
const FETCH_TIMEOUT_MS = 5000
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/**
 * Produce a blurred, base64 encoded placeholder for a Drupal image.
 *
 * Tagged so that replacing a file at an existing url can invalidate the derived placeholder. Without a tag the entry
 * would sit in the cache untouched for the life of the deployment.
 */
export const getImagePlaceholder = async (src: string): Promise<ReturnProps> => {
  "use cache: remote"

  cacheTag("images")

  // Only derive placeholders for our own media. This function fetches whatever url it is handed, so it must not be
  // pointed at arbitrary hosts.
  if (!src.startsWith(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)) return {}

  try {
    const response = await fetch(src, {signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)})
    if (!response.ok) throw new Error(`Responded ${response.status} ${response.statusText} for ${src}`)

    // Headers resolve ahead of the body, so an oversized original can be dropped before it is transferred. A missing
    // content-length reads as 0 here, which falls through to the size check below.
    if (Number(response.headers.get("content-length")) > MAX_IMAGE_BYTES) {
      await response.body?.cancel()
      return {}
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > MAX_IMAGE_BYTES) return {}

    const {base64: blurDataURL} = await getPlaiceholder(buffer, {size: 10})
    return {placeholder: "blur", blurDataURL}
  } catch (err) {
    console.warn(err instanceof Error ? err.message : "Unable to produce placeholder image: " + src)
  }
  return {}
}
