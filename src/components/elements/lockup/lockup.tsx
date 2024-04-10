import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {LockupSetting, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d";

type Props =
  Omit<LockupSetting, "__typename" | "id" | "metatag"> &
  Omit<StanfordBasicSiteSetting, "__typename" | "id" | "metatag">

export const Lockup = ({
  suUseThemeLogo,
  suUploadLogoImage,
  suSiteName,
}: Props) => {
  const logoUrl = !suUseThemeLogo ? suUploadLogoImage?.url : undefined;
  const lockupProps = {
    siteName: suSiteName || "Stanford",
    logoUrl: logoUrl,
  }

  
  return (
    <div className="py-10">
    <Link href="/"
          className="flex flex-col lg:flex-row gap-4 no-underline">
      <LockupLogo {...lockupProps}/>
    </Link>
  </div>
  )
}
export default Lockup;