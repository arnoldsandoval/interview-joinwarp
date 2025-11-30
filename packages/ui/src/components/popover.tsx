import * as Ariakit from "@ariakit/react";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from "react";

import { cn } from "../lib/utils";

interface PopoverProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Ariakit.PopoverStoreProps["placement"];
}

function Popover({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  placement,
  ...props
}: PopoverProps) {
  const popover = Ariakit.usePopoverStore({
    defaultOpen,
    open,
    setOpen: onOpenChange,
    ...(placement && { placement }),
  });

  return (
    <Ariakit.PopoverProvider store={popover}>
      {children}
    </Ariakit.PopoverProvider>
  );
}

const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Ariakit.PopoverDisclosure>
>(({ className, ...props }, ref) => (
  <Ariakit.PopoverDisclosure
    ref={ref}
    data-slot="popover-trigger"
    className={className}
    {...props}
  />
));
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof Ariakit.Popover> {
  // For backwards compatibility with Radix API
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  alignOffset?: number;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, sideOffset = 4, alignOffset = 0, children, ...props }, ref) => {
    return (
      <Ariakit.Popover
        ref={ref}
        data-slot="popover-content"
        gutter={sideOffset}
        shift={alignOffset}
        className={cn(
          "bg-popover text-popover-foreground opacity-0 scale-0 data-[enter]:opacity-100 data-[enter]:scale-100 data-[leave]:opacity-0 data-[leave]:scale-95 transition-all duration-150 z-50 w-72 rounded-2xl border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      >
        {children}
      </Ariakit.Popover>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

// PopoverAnchor - for custom positioning reference
const PopoverAnchor = forwardRef<
  ElementRef<typeof Ariakit.PopoverAnchor>,
  ComponentPropsWithoutRef<typeof Ariakit.PopoverAnchor>
>((props, ref) => (
  <Ariakit.PopoverAnchor ref={ref} data-slot="popover-anchor" {...props} />
));
PopoverAnchor.displayName = "PopoverAnchor";

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
