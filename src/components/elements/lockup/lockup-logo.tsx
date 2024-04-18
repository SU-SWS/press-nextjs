import {Maybe} from "@lib/gql/__generated__/drupal.d";
import PressFooterLogoLg from "@components/images/logo-lg";
import PressFooterLogoXs from "@components/images/logo-xs";

const LockupLogo = ({logoUrl}: { logoUrl?: Maybe<string>, siteName?: Maybe<string> }) => {

  return (
    <>
      <div className="hidden sm:block">
        {!logoUrl &&
          <PressFooterLogoLg/>
        }
      </div>
      <div className="sm:hidden">
        {!logoUrl &&
          <PressFooterLogoXs/>
        }
      </div>
    </>
  )
}

export default LockupLogo;