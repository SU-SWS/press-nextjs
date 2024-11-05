import "../src/styles/index.css"
import BackToTop from "@components/elements/back-to-top"
import PageFooter from "@components/global/page-footer"
import PageHeader from "@components/global/page-header"
import {Icon} from "next/dist/lib/metadata/types/metadata-types"
import {montserrat} from "../src/styles/fonts"
import DrupalWindowSync from "@components/elements/drupal-window-sync"
import UserAnalytics from "@components/elements/user-analytics"
import Editori11y from "@components/tools/editorially"

const appleIcons: Icon[] = [60, 72, 76, 114, 120, 144, 152, 180].map(size => ({
  url: "/favicon.ico",
  sizes: `${size}x${size}`,
}))

/**
 * Metadata that does not change often.
 */
export const metadata = {
  metadataBase: new URL("https://sup.org"),
  twitter: {
    card: "summary_large_image",
    site: "@stanfordpress",
    creator: "@stanfordpress",
  },
  icons: {
    icon: [{url: "/favicon.ico"}],
    apple: appleIcons,
  },
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false

const RootLayout = ({children, modal}: {children: React.ReactNode; modal: React.ReactNode}) => {
  const isDevMode = process.env.NODE_ENV === "development"
  return (
    <html lang="en" className={montserrat.className}>
      <UserAnalytics />
      <DrupalWindowSync />
      {isDevMode && <Editori11y />}

      <body className="text-stone-dark">
        <nav aria-label="Skip Links">
          <a href="#main-content" className="skiplink">
            Skip to main content
          </a>
        </nav>

        <div className="flex min-h-screen flex-col">
          <PageHeader />
          <main id="main-content" className="mb-32 flex-grow">
            {children}

            <BackToTop />
          </main>
          <PageFooter />
        </div>
        {modal}
      </body>
    </html>
  )
}
export default RootLayout
