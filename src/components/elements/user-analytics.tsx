import {getConfigPageField} from "@lib/gql/gql-queries"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"
import Script from "next/script"
import {GoogleAnalytics} from "@next/third-parties/google"

const UserAnalytics = async () => {
  if (process.env.VERCEL_ENV !== "production") return

  const googleAnalytics = await getConfigPageField<
    StanfordBasicSiteSetting,
    StanfordBasicSiteSetting["suGoogleAnalytics"]
  >("StanfordBasicSiteSetting", "suGoogleAnalytics")

  if (!googleAnalytics) return
  return (
    <>
      <Script async src="//siteimproveanalytics.com/js/siteanalyze_6343745.js" />
      <GoogleAnalytics gaId={googleAnalytics} />
    </>
  )
}
export default UserAnalytics
