import {H1} from "@components/elements/headers"
import RedirectSignup from "./redirect-signup"

const Page = () => {
  return (
    <article className="centered mt-32">
      <title>Newsletter Signup | Stanford University Press</title>
      <meta name="robots" content="noindex" />
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="rs-mb-2" id="page-title">
          Newsletter Signup
        </H1>
        <RedirectSignup />
      </div>
    </article>
  )
}

export default Page
