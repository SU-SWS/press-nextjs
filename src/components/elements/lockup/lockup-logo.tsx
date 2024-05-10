
import {HTMLAttributes} from "react";
import FooterLogoLg from "@components/images/footer-logo-lg";
import FooterLogoXs from "@components/images/footer-logo-xs";

type Props = HTMLAttributes<HTMLOrSVGElement>

const LockupLogo = ({...props}: Props) => {

  return (
    <>
      <div className="hidden sm:block">
        <FooterLogoLg {...props}/>
      </div>
      <div className="sm:hidden">
        <FooterLogoXs {...props}/>
      </div>
    </>
  )
}

export default LockupLogo;