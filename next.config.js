const drupalUrl = new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL);

const nextConfig = {
  experimental: {},
  typescript: {
    // Disable build errors since dev dependencies aren't loaded on prod. Rely on GitHub actions to throw any errors.
    ignoreBuildErrors: process.env.CI !== 'true',
  },
  images: {
    remotePatterns: [
      {
        // Allow any stanford domain for images.
        hostname: '**.stanford.edu',
      },
      {
        protocol: drupalUrl.protocol.replace(':', ''),
        hostname: drupalUrl.hostname,
      },
      {
        protocol: 'https',
        hostname: 'localist-images.azureedge.net'
      },
      {
        hostname: '**.gitpod.io'
      }
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/books/(title|awards|precart)",
          destination:  "/books/legacy/:workId",
          has: [
            {
              type: "query",
              key: "id",
              value: "(?<workId>.*)"
            }
          ]
        },
        {
          source: "/books/comp",
          destination:  "/books/legacy/:workId/comp",
          has: [
            {
              type: "query",
              key: "id",
              value: "(?<workId>.*)"
            }
          ]
        },
        {
          source: "/books/extra",
          destination:  "/books/legacy/:workId/extra",
          has: [
            {
              type: "query",
              key: "id",
              value: "(?<workId>.*)"
            }
          ]
        },
        {
          source: '/img/:path*',
          destination: '/not-found',
        },
        {
          source: '/wp-:path*',
          destination: '/not-found',
        }
      ]
    };
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/user/:slug*',
        destination: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + '/user/login',
        permanent: true,
      },
      {
        source: '/saml/login',
        destination: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + '/user/login',
        permanent: true,
      },
    ]
  },
  async headers() {
    if (process.env.NEXT_PUBLIC_DOMAIN) {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex,nofollow,noarchive',
          },
        ],
      },
    ];
  }
};

module.exports = nextConfig;

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
  module.exports = withBundleAnalyzer(nextConfig);
}
