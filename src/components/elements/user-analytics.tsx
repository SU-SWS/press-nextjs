import {getConfigPageField} from "@lib/gql/gql-queries"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import Script from "next/script"
import {GoogleAnalytics} from "@next/third-parties/google"

const UserAnalytics = async () => {
  if (process.env.NODE_ENV === "development") return

  const googleAnalytics = await getConfigPageField<
    StanfordBasicSiteSetting,
    StanfordBasicSiteSetting["suGoogleAnalytics"]
  >("StanfordBasicSiteSetting", "suGoogleAnalytics")

  if (!googleAnalytics) return
  return (
    <>
      <Script async src="//siteimproveanalytics.com/js/siteanalyze_80352.js" />
      <GoogleAnalytics gaId={googleAnalytics} />
    </>
  )
}
export default UserAnalytics
