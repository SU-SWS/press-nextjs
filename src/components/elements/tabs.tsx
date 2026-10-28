"use client"

import {useCallback, useState} from "react"
import {
  Tabs as BaseTabs,
  type TabsRootProps,
  type TabsListProps,
  type TabsTabProps,
  type TabsPanelProps,
  type TabsRoot,
  type TabsTab,
} from "@base-ui/react/tabs"
import {useScreen} from "usehooks-ts"
import cn from "@lib/utils/className"
import useSearchParamAfterHydration from "@lib/hooks/useSearchParamAfterHydration"

type TabsProps = TabsRootProps & {
  className?: string
  queryKey?: string
}

const TabsInner = ({
  orientation,
  queryKey,
  onValueChange,
  defaultValue,
  value,
  className,
  children,
  ...props
}: TabsProps) => {
  const screen = useScreen({initializeWithValue: false})
  const isVertical = (screen && screen.width < 768) || orientation === "vertical"
  const queryValue = useSearchParamAfterHydration(queryKey)

  // Controlled state, so a tab chosen from the URL doesn't change the defaultValue of an uncontrolled component. Until
  // a tab is clicked, the URL's tab (or the default) is active.
  const [chosenTab, setActiveTab] = useState<TabsTab.Value | undefined>()
  const activeTab = chosenTab ?? queryValue ?? defaultValue

  const handleValueChange = useCallback(
    (newValue: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => {
      if (queryKey && newValue) {
        const params = new URLSearchParams(window.location.search)
        params.delete(queryKey)
        if (newValue !== defaultValue) params.set(queryKey, String(newValue))
        // Native History API instead of router.replace, so a tab change doesn't fetch the page from the server.
        window.history.replaceState(null, "", `?${params.toString()}`)
        setActiveTab(newValue)
      }
      onValueChange?.(newValue, eventDetails)
    },
    [queryKey, onValueChange, defaultValue]
  )

  return (
    <BaseTabs.Root
      {...props}
      className={cn("centered flex gap-12.5", {"flex-col": !isVertical}, className)}
      value={activeTab}
      orientation={isVertical ? "vertical" : "horizontal"}
      onValueChange={handleValueChange}
    >
      {children}
    </BaseTabs.Root>
  )
}

export const Tabs = (props: TabsProps) => {
  return <TabsInner {...props} />
}

type ListProps = TabsListProps & {
  className?: string
}

export const TabsList = ({className, children, ...props}: ListProps) => {
  return (
    <BaseTabs.List {...props} className={cn("flex data-[orientation=vertical]:flex-col", className)}>
      {children}
    </BaseTabs.List>
  )
}

type TabProps = TabsTabProps & {
  className?: string
}

export const Tab = ({className, children, ...props}: TabProps) => {
  return (
    <BaseTabs.Tab
      {...props}
      className={cn(
        "w-fit border-transparent p-12.5 aria-selected:border-[#6AA083] data-[orientation=horizontal]:border-b-3 data-[orientation=vertical]:border-l-3 hocus:underline",
        {
          "bg-black-10": props.disabled,
        },
        className
      )}
    >
      {children}
    </BaseTabs.Tab>
  )
}

type TabPanelProps = TabsPanelProps & {
  className?: string
}

export const TabPanel = ({className, children, ...props}: TabPanelProps) => {
  return <BaseTabs.Panel {...props}>{children}</BaseTabs.Panel>
}
