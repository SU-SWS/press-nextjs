import type {NextConfig} from "next"
import {INFINITE_CACHE} from "next/dist/lib/constants"

const drupalUrl = new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)

// Document types proxied from Drupal's public files directory by the `/files/` rewrite. Keep in sync with
// `getLinkHref` in src/components/elements/link.tsx. Matching is case-insensitive, so `.PDF` is included.
const DOCUMENT_EXTENSIONS = ["txt", "rtf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf", "mp3", "wav", "epub"]
// A single path segment. Slashes and backslashes, including percent-encoded ones that the upstream
// server could decode into separators, are not allowed inside it.
const FILE_PATH_SEGMENT = "(?:(?!%2f|%5c)[^/\\\\])+"
// A directory segment, which can't be `.` or `..` (literal or percent-encoded). That keeps the rewritten
// path inside `/sites/[site]/files` rather than walking up to anything else on the Drupal host.
const FILE_PATH_DIRECTORY = `(?!(?:\\.|%2e){1,2}/)${FILE_PATH_SEGMENT}/`
// Any depth of directories, then a file name ending in one of the document extensions.
const DOCUMENT_FILE_PATH = `(?:${FILE_PATH_DIRECTORY})*${FILE_PATH_SEGMENT}\\.(?:${DOCUMENT_EXTENSIONS.join("|")})`

const nextConfig: NextConfig = {
  experimental: {
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  cacheComponents: true,
  typescript: {
    // Disable build errors since dev dependencies aren't loaded on prod. Rely on GitHub actions to throw any errors.
    ignoreBuildErrors: process.env.CI !== "true",
  },
  cacheLife: {
    default: {
      stale: INFINITE_CACHE,
      revalidate: INFINITE_CACHE,
      expire: INFINITE_CACHE,
    },
    months: {
      stale: 60 * 60 * 24 * 30,
      revalidate: 60 * 60 * 24 * 30,
      expire: 60 * 60 * 24 * 30,
    },
  },
  images: {
    minimumCacheTTL: 2678400,
    // Every width and quality is a separately billed transformation per source image. The defaults allow 15 widths up
    // to 3840px; these 7 still cover the smallest rendered image (300px) through a full-width banner on a 2x display.
    imageSizes: [256, 384],
    deviceSizes: [640, 828, 1200, 1920, 2560],
    qualities: [75],
    // Local addresses are only reachable from a developer machine. Allowing them in production turns the optimizer
    // into an SSRF probe against the deployment's own network.
    dangerouslyAllowLocalIP: !process.env.VERCEL_ENV,
    // Every pattern pins `search: ""` so the optimizer rejects query strings. Without it, `?v=1`, `?v=2`, ... are each
    // treated as a distinct source image, which lets anyone run up unbounded billed transformations. Components render
    // through `@components/images/image`, which strips query strings so sources that carry one still render.
    remotePatterns: [
      {
        protocol: drupalUrl.protocol.replace(":", "") === "http" ? "http" : "https",
        hostname: drupalUrl.hostname,
        pathname: "/sites/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "localist-images.azureedge.net",
        search: "",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return {
      afterFiles: [],
      fallback: [],
      beforeFiles: [
        {
          source: `/files/:site(\\w+)/:slug(${DOCUMENT_FILE_PATH})`,
          destination: `${drupalUrl.protocol}//${drupalUrl.hostname}/sites/:site/files/:slug`,
        },
        {
          source: "/books/(title|awards|precart)",
          destination: "/books/legacy/:workId",
          has: [
            {
              type: "query",
              key: "id",
              value: "(?<workId>.*)",
            },
          ],
        },
        {
          source: "/books/comp",
          destination: "/books/legacy/:workId/comp",
          has: [
            {
              type: "query",
              key: "id",
              value: "(?<workId>.*)",
            },
          ],
        },
        {
          source: "/books/extra",
          destination: "/books/legacy/:workId/extra",
          has: [
            {
              type: "query",
              key: "id",
              value: "(?<workId>.*)",
            },
          ],
        },
        {
          source: "/img/:path*",
          destination: "/not-found",
        },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: "/wp-:path",
        destination: "/not-found",
        permanent: true,
      },
      {
        source: "/wp-:slug/:path*",
        destination: "/not-found",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/user/:slug*",
        destination: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/user/login",
        permanent: true,
      },
      {
        source: "/saml/login",
        destination: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/user/login",
        permanent: true,
      },
    ]
  },
  async headers() {
    if (process.env.VERCEL_ENV === "production") {
      return []
    }
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex,nofollow,noarchive",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
