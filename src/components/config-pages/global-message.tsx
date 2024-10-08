import {BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon} from "@heroicons/react/20/solid"
import {H2} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"
import {clsx} from "clsx"
import {StanfordGlobalMessage} from "@lib/gql/__generated__/drupal.d"
import {getConfigPage} from "@lib/gql/gql-queries"
import {HTMLAttributes} from "react"
import {twMerge} from "tailwind-merge"

const GlobalMessage = async ({...props}: HTMLAttributes<HTMLDivElement>) => {
  const globalMessageConfig = await getConfigPage<StanfordGlobalMessage>("StanfordGlobalMessage")
  if (!globalMessageConfig?.suGlobalMsgEnabled) return

  const MessageWrapper = globalMessageConfig.suGlobalMsgHeader ? "article" : "div"
  return (
    <MessageWrapper
      {...props}
      aria-labelledby={MessageWrapper ? globalMessageConfig.id : undefined}
      className={twMerge(
        "relative z-[1] py-10",
        clsx({
          "bg-digital-blue-dark text-white": globalMessageConfig.suGlobalMsgType === "info",
          "bg-illuminating-dark": globalMessageConfig.suGlobalMsgType === "warning",
          "bg-digital-green text-white": globalMessageConfig.suGlobalMsgType === "success",
          "bg-foggy-light": globalMessageConfig.suGlobalMsgType === "plain",
          "bg-digital-red text-white": globalMessageConfig.suGlobalMsgType === "error",
        }),
        props.className
      )}
    >
      <div className="centered flex flex-col gap-10 lg:flex-row">
        <div className="flex shrink-0 items-center leading-none">
          <MessageIcon messageType={globalMessageConfig.suGlobalMsgType} />
          {globalMessageConfig.suGlobalMsgLabel}:
        </div>
        <div className="[&_a.btn]:border-2 [&_a.btn]:border-white [&_a.btn]:bg-transparent [&_a]:text-white">
          {globalMessageConfig.suGlobalMsgHeader && (
            <H2 id={globalMessageConfig.id}>{globalMessageConfig.suGlobalMsgHeader}</H2>
          )}

          <Wysiwyg html={globalMessageConfig.suGlobalMsgMessage?.processed} />

          {globalMessageConfig.suGlobalMsgLink?.url && (
            <Link href={globalMessageConfig.suGlobalMsgLink.url} className="text-white">
              {globalMessageConfig.suGlobalMsgLink.title}
            </Link>
          )}
        </div>
      </div>
    </MessageWrapper>
  )
}

const MessageIcon = ({messageType}: {messageType: StanfordGlobalMessage["suGlobalMsgType"]}) => {
  switch (messageType) {
    case "info":
      return <InformationCircleIcon width={40} />
    case "success":
      return <CheckCircleIcon width={40} />
    case "plain":
      return <BellIcon width={40} />
  }
  return <ExclamationTriangleIcon width={40} />
}

export default GlobalMessage
