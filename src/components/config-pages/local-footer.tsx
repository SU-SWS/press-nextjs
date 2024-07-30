import Link from "@components/elements/link"
import Wysiwyg from "@components/elements/wysiwyg"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {H2} from "@components/elements/headers"
import TwitterIcon from "@components/elements/icons/TwitterIcon"
import YoutubeIcon from "@components/elements/icons/YoutubeIcon"
import FacebookIcon from "@components/elements/icons/FacebookIcon"
import InstagramIcon from "@components/elements/icons/InstagramIcon"
import {StanfordLocalFooter} from "@lib/gql/__generated__/drupal.d"
import {getConfigPage} from "@lib/gql/gql-queries"

const LocalFooter = async () => {
  const localFooterConfig = await getConfigPage<StanfordLocalFooter>("StanfordLocalFooter")
  if (!localFooterConfig?.suFooterEnabled) return

  return (
    <div className="rs-py-6 local-footer bg-stone-dark">
      <div className="centered">
        <div className="rs-mb-3">
          <FooterLockup />
        </div>
        <div className="grid grid-cols-1 sm:rs-ml-4 sm:grid-cols-2 2xl:grid-cols-4 [&_a:focus]:text-bay-light [&_a:hover]:text-bay-light [&_a:hover]:decoration-bay-light [&_a:hover]:decoration-2 [&_a]:text-white [&_a]:decoration-fog-dark [&_a]:decoration-1 [&_a]:underline-offset-[5px] [&_a]:transition [&_h2_a]:font-medium [&_h2_a]:underline [&_h2_a]:decoration-fog-dark [&_h2_a]:decoration-1 [&_h2_strong]:font-medium [&_li]:mb-4 [&_li]:text-[0.9em] [&_li_a]:font-normal [&_p]:text-[0.9em]">
          <div className="list-unstyled rs-pb-1 rs-pt-4 sm:border-r sm:border-fog-dark">
            {/* Content block 1 */}
            <Wysiwyg html={localFooterConfig.suLocalFootPrCo?.processed} className="max-w-[250px]" />

            {/* Action Links */}
            {localFooterConfig.suLocalFootAction && (
              <ul className="list-unstyled rs-pt-4">
                {localFooterConfig.suLocalFootAction.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-action-link-${index}`}>
                      <Link href={link.url}>{link.title}</Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="list-unstyled rs-pb-1 rs-pt-4 2xl:rs-pl-4 sm:order-4 sm:border-r sm:border-fog-dark">
            {/* Content block 3 */}
            <Wysiwyg html={localFooterConfig.suLocalFootTr2Co?.processed} className="max-w-[250px]" />
            {/* Primary Links */}
            {localFooterConfig.suLocalFootPrimeH && (
              <H2 className="rs-pt-4 type-2 text-white">{localFooterConfig.suLocalFootPrimeH}</H2>
            )}
            {localFooterConfig.suLocalFootPrimary && (
              <ul className="list-unstyled">
                {localFooterConfig.suLocalFootPrimary.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-primary-link-${index}`}>
                      <Link href={link.url}>{link.title}</Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="list-unstyled rs-pb-1 rs-pt-4 sm:rs-pl-4 2xl:rs-pl-4 sm:border-r sm:border-fog-dark">
            {/* Content block 2 */}
            <Wysiwyg html={localFooterConfig.suLocalFootSeCo?.processed} className="max-w-[250px]" />
            {/* Secondary links */}
            {localFooterConfig.suLocalFootSecondH && (
              <H2 className="rs-pt-4 type-2 text-white">{localFooterConfig.suLocalFootSecondH}</H2>
            )}

            {localFooterConfig.suLocalFootSecond && (
              <ul className="list-unstyled">
                {localFooterConfig.suLocalFootSecond.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-second-link-${index}`}>
                      <Link href={link.url}>{link.title}</Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="list-unstyled rs-pb-1 rs-pt-4 order-4 sm:rs-pl-4 2xl:rs-pl-4 sm:border-r sm:border-fog-dark 2xl:border-0">
            {/* Content block 4 */}
            <Wysiwyg html={localFooterConfig.suLocalFootTrCo?.processed} className="max-w-[250px]" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      {localFooterConfig.suLocalFootSocial && (
        <ul className="list-unstyled rs-mb-0 mx-auto flex w-fit">
          {localFooterConfig.suLocalFootSocial.map((link, index) => {
            if (!link.url) return
            return (
              <li key={`footer-action-link-${index}`} className="rs-mr-0">
                <Link href={link.url} className="text-white hocus:text-bay-light">
                  <SocialIcon url={link.url} />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
      <div className="text-center text-white lg:centered lg:text-left [&_a]:text-21 [&_p]:text-21">
        © 2024 Stanford University Press. All rights reserved.
      </div>
    </div>
  )
}

const SocialIcon = ({url}: {url: string}) => {
  if (url.includes("facebook")) return <FacebookIcon />
  if (url.includes("twitter.com")) return <TwitterIcon />
  if (url.includes("youtube.com")) return <YoutubeIcon />
  if (url.includes("instagram.com")) return <InstagramIcon />
  return null
}

const FooterLockup = () => {
  return (
    <div className="py-10">
      <Link
        href="/"
        className="flex flex-col gap-4 no-underline lg:flex-row"
        aria-label="Stanford University Press Home"
      >
        <LockupLogo />
      </Link>
    </div>
  )
}
export default LocalFooter
