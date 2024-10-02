import Wysiwyg from "@components/elements/wysiwyg"
import View from "@components/views/view"
import {H2} from "@components/elements/headers"
import {ElementType, HtmlHTMLAttributes} from "react"
import {ParagraphStanfordList} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {twMerge} from "tailwind-merge"
import {ListParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"
import clsx from "clsx"
import ActionLink from "@components/elements/action-link"
import {getViewItems, loadViewPage} from "@lib/gql/gql-view-queries"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordList
}

const ListParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<ListParagraphBehaviors>(paragraph)
  const viewId = paragraph.suListView?.view
  const displayId = paragraph.suListView?.display
  const {items: viewItems, totalItems} =
    viewId && displayId
      ? await getViewItems(
          viewId,
          displayId,
          paragraph.suListView?.contextualFilter,
          undefined,
          0,
          paragraph.suListView?.pageSize
        )
      : {items: [], totalItems: 0}
  const addLoadMore = (paragraph.suListView?.pageSize || 3) > 99

  if (behaviors.list_paragraph?.hide_empty && viewItems.length === 0) return null

  const ListWrapper: ElementType =
    paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" ? "section" : "div"

  return (
    <ListWrapper
      {...props}
      className={twMerge(
        "rs-mb-4 centered flex flex-col gap-[5.5rem] border-t border-press-sand pt-14",
        clsx({
          "border-0": !paragraph.suListHeadline,
        }),
        props.className
      )}
      aria-labelledby={ListWrapper === "section" ? paragraph.id : undefined}
    >
      <div className="flex w-full flex-col justify-between @3xl:flex-row">
        <div className="flex max-w-1000 flex-col">
          {ListWrapper === "section" && (
            <H2
              id={paragraph.id}
              className={twMerge(
                "mb-0 pb-0 font-medium",
                behaviors.list_paragraph?.heading_behavior === "hide" && "sr-only"
              )}
            >
              {paragraph.suListHeadline}
            </H2>
          )}

          {paragraph.supListEyebrow && (
            <div className="rs-mb-neg2 type-0 order-first text-press-sand-dark xl:text-21">
              {paragraph.supListEyebrow}
            </div>
          )}
        </div>

        {paragraph.suListButton?.url && (
          <ActionLink
            href={paragraph.suListButton.url}
            className="text-18 font-normal text-archway-dark no-underline *:text-press-sand-dark hocus:underline hocus:decoration-2 hocus:underline-offset-[5px]"
          >
            {paragraph.suListButton.title}
          </ActionLink>
        )}
      </div>

      <Wysiwyg className="max-w-800" html={paragraph.suListDescription?.processed} />

      {viewId && displayId && viewItems && (
        <div className="mx-auto max-w-[1600px]">
          <View
            viewId={viewId}
            displayId={displayId}
            items={viewItems}
            headingLevel={paragraph.suListHeadline ? "h3" : "h2"}
            loadPage={
              addLoadMore
                ? loadViewPage.bind(
                    null,
                    viewId,
                    displayId,
                    paragraph.suListView?.contextualFilter || [],
                    !!paragraph.suListHeadline
                  )
                : undefined
            }
            totalItems={totalItems}
          />
        </div>
      )}

      {viewItems.length === 0 && behaviors.list_paragraph?.empty_message && (
        <p>{behaviors.list_paragraph.empty_message}</p>
      )}
    </ListWrapper>
  )
}
export default ListParagraph
