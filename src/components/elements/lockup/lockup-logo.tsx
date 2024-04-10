import {Maybe} from "@lib/gql/__generated__/drupal.d";
import PressFooterLogoLg from "@components/images/logo-lg";
import PressFooterLogoXs from "@components/images/logo-xs";

const LockupLogo = ({logoUrl, siteName = ""}: { logoUrl?: Maybe<string>, siteName?: Maybe<string> }) => {
  return (
    <>
      {logoUrl &&
        <picture>
          <img
            src={logoUrl}
            alt={`${siteName} Logo`}
            className="object-contain max-w-[400px] max-h-[35px] h-auto"
          />
        </picture>
      }
      {!logoUrl &&
        <PressFooterLogoLg className="block no-underline max-h-[30px] w-auto"/>
      }
    </>
  )
}

export default LockupLogo;