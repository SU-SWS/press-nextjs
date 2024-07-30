import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"
import {LockClosedIcon} from "@heroicons/react/24/outline"
import {H2} from "@components/elements/headers"
import {StanfordSuperFooter} from "@lib/gql/__generated__/drupal.d"
import {getConfigPage} from "@lib/gql/gql-queries"

const SuperFooter = async () => {
  const superFooterConfig = await getConfigPage<StanfordSuperFooter>("StanfordSuperFooter")
  if (!superFooterConfig?.suSuperFootEnabled) return

  return (
    <div className="border-b border-black-20 bg-foggy-light py-20">
      <div className="centered flex justify-between">
        <div className="flex-1">
          {superFooterConfig.suSuperFootTitle && <H2 className="type-1">{superFooterConfig.suSuperFootTitle}</H2>}

          <Wysiwyg html={superFooterConfig.suSuperFootText?.processed} />
        </div>

        <div className="flex-1 text-right">
          <div className="inline-block">
            {superFooterConfig.suSuperFootLink && (
              <>
                {superFooterConfig.suSuperFootLink.map((link, index) => {
                  if (!link.url) return
                  return (
                    <Link
                      key={`super-footer-link-${index}`}
                      href={link.url}
                      className="mb-5 block border border-black-20 bg-white p-10 text-digital-red no-underline shadow-lg transition last:mb-0 hocus:bg-black hocus:text-white hocus:underline"
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </>
            )}

            {superFooterConfig.suSuperFootIntranet?.url && (
              <Link
                href={superFooterConfig.suSuperFootIntranet.url}
                className="flex items-center text-digital-red no-underline hocus:text-black hocus:underline"
              >
                {superFooterConfig.suSuperFootIntranet.title}
                <LockClosedIcon width={20} className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SuperFooter
