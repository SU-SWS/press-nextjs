import Link from "@components/elements/link";
import Wysiwyg from "@components/elements/wysiwyg";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {H2} from "@components/elements/headers";
import TwitterIcon from "@components/elements/icons/TwitterIcon";
import YoutubeIcon from "@components/elements/icons/YoutubeIcon";
import FacebookIcon from "@components/elements/icons/FacebookIcon";
import InstagramIcon from "@components/elements/icons/InstagramIcon";
import {StanfordLocalFooter} from "@lib/gql/__generated__/drupal.d";

const LocalFooter = ({
  suFooterEnabled,
  suLocalFootAction,
  suLocalFootPrCo,
  suLocalFootPrimary,
  suLocalFootPrimeH,
  suLocalFootSeCo,
  suLocalFootSecond,
  suLocalFootSecondH,
  suLocalFootSocial,
  suLocalFootTr2Co,
  suLocalFootTrCo,
}: StanfordLocalFooter) => {
  if (!suFooterEnabled) return;

  return (
    <div className="local-footer rs-py-6 bg-stone-dark">
      <div className="centered">
        <div className="rs-mb-6">
          <FooterLockup/>
        </div>

        {/* Social Links */}
        {suLocalFootSocial &&
          <ul className="list-unstyled flex rs-mb-0">
            {suLocalFootSocial.map((link, index) => {
              if (!link.url) return;
              return (
                <li key={`footer-action-link-${index}`} className="rs-mr-0">
                  <Link href={link.url} className="text-white hocus:text-bay-light">
                    <SocialIcon url={link.url}/>
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        }
        <div
          className="grid 2xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:rs-ml-4 [&_a]:font-normal [&_a]:decoration-1 [&_a]:text-white [&_a]:decoration-white [&_a:hover]:decoration-2 [&_a:hover]:decoration-bay-light  [&_a:hover]:text-bay-light  [&_a:focus]:text-bay-light [&_a]:transition">
          <div className="list-unstyled sm:border-r  sm:border-fog-dark">
            {/* Content block 1 */}
            <Wysiwyg html={suLocalFootPrCo?.processed} className="max-w-[250px]"/>

            {/* Action Links */}
            {suLocalFootAction &&
              <ul className="list-unstyled rs-pt-4">
                {suLocalFootAction.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-action-link-${index}`}>
                      <Link href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }
          </div>

          <div className="2xl:rs-pl-4 list-unstyled sm:order-4 sm:border-r  sm:border-fog-dark">
            {/* Content block 3 */}
            <Wysiwyg html={suLocalFootTr2Co?.processed} className="max-w-[250px]"/>
            {/* Primary Links */}
            {suLocalFootPrimeH &&
              <H2 className="text-m1 text-white rs-pt-4">{suLocalFootPrimeH}</H2>}
            {suLocalFootPrimary &&
              <ul className="list-unstyled">
                {suLocalFootPrimary.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-primary-link-${index}`}>
                      <Link href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }
          </div>

          <div className="2xl:rs-pl-4 sm:rs-pl-4 list-unstyled sm:border-r  sm:border-fog-dark">
            {/* Content block 2 */}
            <Wysiwyg html={suLocalFootSeCo?.processed} className="max-w-[250px]"/>
            {/* Secondary links */}
            {suLocalFootSecondH &&
              <H2 className="text-m1 text-white  rs-pt-4">{suLocalFootSecondH}</H2>}

            {suLocalFootSecond &&
              <ul className="list-unstyled">
                {suLocalFootSecond.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-second-link-${index}`}>
                      <Link href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }

          </div>

          <div className="2xl:rs-pl-4 sm:rs-pl-4 list-unstyled order-4 sm:border-r  sm:border-fog-dark 2xl:border-0">
            {/* Content block 4 */}
            <Wysiwyg html={suLocalFootTrCo?.processed} className="max-w-[250px]"/>
          </div>
        </div>
      </div>
      <div className="text-white text-21 text-center lg:text-left lg:centered rs-mt-8 rs-mb-6">
        © 2024 Stanford University Press. All rights reserved.
      </div>
    </div>
  )
}

const SocialIcon = ({url}: { url: string }) => {
  if (url.includes("facebook")) return <FacebookIcon/>
  if (url.includes("twitter.com")) return <TwitterIcon/>
  if (url.includes("youtube.com")) return <YoutubeIcon/>
  if (url.includes("instagram.com")) return <InstagramIcon/>
  return null;
}

const FooterLockup = () => {

  return (
    <div className="py-10">
      <Link href="/" className="flex flex-col lg:flex-row gap-4 no-underline">
        <LockupLogo/>
      </Link>
    </div>
  )

}
export default LocalFooter;