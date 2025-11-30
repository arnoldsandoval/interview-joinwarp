import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from "@ariakit/react"
import React from "react"

function Collapsible({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DisclosureProvider> & {
  className?: string;
}) {
  return (
    <DisclosureProvider {...props}>
      <div data-slot="collapsible" className={className}>
        {children}
      </div>
    </DisclosureProvider>
  )
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof Disclosure>) {
  return (
    <Disclosure
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof DisclosureContent>) {
  return (
    <DisclosureContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
