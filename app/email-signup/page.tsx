import {H1} from "@components/elements/headers"
import RedirectSignup from "../search/redirect-signup"

const Page = () => {
  return (
    <div className="centered mt-32">
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="rs-mb-2" id="page-title">
          Newsletter Signup
        </H1>
        <RedirectSignup />
      </div>
    </div>
  )
}

export default Page
