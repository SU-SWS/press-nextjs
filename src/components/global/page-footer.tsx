import LocalFooter from "@components/config-pages/local-footer"
import SuperFooter from "@components/config-pages/super-footer"
import {cacheTag} from "next/cache"

const PageFooter = async () => {
  "use cache: remote"
  cacheTag("config-pages")

  return (
    <footer>
      <SuperFooter />
      <LocalFooter />
    </footer>
  )
}
export default PageFooter
