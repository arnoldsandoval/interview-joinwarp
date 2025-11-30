"use client";

import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
  useDisclosureStore,
} from "@ariakit/react";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

interface AccordionContextValue {
  type: "single" | "multiple";
  collapsible?: boolean;
  disabled?: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null
);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

function Accordion({
  type = "single",
  collapsible = false,
  disabled = false,
  value,
  onValueChange,
  defaultValue,
  className,
  children,
  ...props
}: {
  type?: "single" | "multiple";
  collapsible?: boolean;
  disabled?: boolean;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // Track open state for single mode accordion behavior
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (value !== undefined) {
      return new Set(Array.isArray(value) ? value : [value].filter(Boolean));
    }
    if (defaultValue !== undefined) {
      return new Set(
        Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue].filter(Boolean)
      );
    }
    return new Set();
  });

  // Keep internal state in sync with controlled value
  React.useEffect(() => {
    if (value !== undefined) {
      const newOpenItems = Array.isArray(value)
        ? value
        : [value].filter(Boolean);
      setOpenItems(new Set(newOpenItems));
    }
  }, [value]);

  const handleItemToggle = React.useCallback(
    (itemValue: string, isOpen: boolean) => {
      setOpenItems((prev) => {
        const newOpenItems = new Set(prev);

        if (type === "single") {
          if (isOpen) {
            // For single mode, close all others and open this one
            newOpenItems.clear();
            newOpenItems.add(itemValue);
          } else if (collapsible) {
            // Only allow closing if collapsible is true
            newOpenItems.delete(itemValue);
          } else {
            // If not collapsible, keep it open
            return prev;
          }
        } else {
          // Multiple mode
          if (isOpen) {
            newOpenItems.add(itemValue);
          } else {
            newOpenItems.delete(itemValue);
          }
        }

        // Call onValueChange with the new value
        const newValue = Array.from(newOpenItems);
        const valueToEmit = type === "single" ? newValue[0] || "" : newValue;

        onValueChange?.(valueToEmit);

        return newOpenItems;
      });
    },
    [type, collapsible, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({
      type,
      collapsible,
      disabled,
    }),
    [type, collapsible, disabled]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div data-slot="accordion" className={className} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === AccordionItem) {
            const itemValue = child.props.value;
            const isOpen = openItems.has(itemValue);

            return React.cloneElement(child, {
              ...child.props,
              isOpen,
              onToggle: handleItemToggle,
            });
          }
          return child;
        })}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  isOpen,
  onToggle,
  className,
  children,
  ...props
}: {
  value: string;
  isOpen?: boolean;
  onToggle?: (value: string, isOpen: boolean) => void;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const accordionContext = useAccordionContext();

  // Use Ariakit's disclosure store for proper accessibility and state management
  const disclosure = useDisclosureStore({
    open: isOpen,
    setOpen: (open) => {
      onToggle?.(value, open);
    },
  });

  return (
    <DisclosureProvider store={disclosure}>
      <div
        data-slot="accordion-item"
        className={cn("border-b last:border-b-0", className)}
        {...props}
      >
        {children}
      </div>
    </DisclosureProvider>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Disclosure>) {
  const accordionContext = useAccordionContext();

  return (
    <div className="flex">
      <Disclosure
        data-slot="accordion-trigger"
        disabled={accordionContext.disabled || props.disabled}
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[aria-expanded=true]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </Disclosure>
    </div>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DisclosureContent>) {
  return (
    <DisclosureContent
      data-slot="accordion-content"
      className={cn(
        "grid overflow-hidden text-sm transition-all duration-200 ease-out",
        "grid-rows-[0fr] data-[enter]:grid-rows-[1fr]"
      )}
      {...props}
    >
      <div className={cn("overflow-hidden")}>
        <div className={cn("pt-0 pb-4", className)}>{children}</div>
      </div>
    </DisclosureContent>
  );
}

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useAccordionContext,
};
