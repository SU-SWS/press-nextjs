import NextImage, {ImageProps} from "next/image"

/**
 * `next/image` with the query string and fragment removed from string sources.
 *
 * Each distinct source url is a separately billed Vercel image transformation, so `?v=1`, `?v=2`, ... would each be
 * transformed again. `images.remotePatterns` rejects any source with a query string, and stripping it here keeps
 * urls that arrive with one (e.g. Drupal image style `?itok=` tokens) rendering instead of failing.
 */
const Image = ({src, alt, ...props}: ImageProps) => (
  <NextImage alt={alt} {...props} src={typeof src === "string" ? src.split(/[?#]/)[0] : src} />
)

export default Image
