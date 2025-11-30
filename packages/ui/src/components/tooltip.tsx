import * as Ariakit from "@ariakit/react";
import * as React from "react";

import { cn } from "../lib/utils";

function TooltipProvider({
  ...props
}: React.ComponentProps<typeof Ariakit.TooltipProvider>) {
  return <Ariakit.TooltipProvider data-slot="tooltip-provider" {...props} />;
}

interface TooltipProps
  extends Omit<React.ComponentProps<typeof Ariakit.TooltipProvider>, "store"> {
  children: React.ReactNode;
  placement?: Ariakit.TooltipStoreProps["placement"];
  timeout?: number;
}

function Tooltip({ children, placement, timeout, ...props }: TooltipProps) {
  const tooltip = Ariakit.useTooltipStore({
    ...(placement && { placement }),
    ...(timeout !== undefined && { timeout }),
  });

  return (
    <Ariakit.TooltipProvider store={tooltip} {...props}>
      {children}
    </Ariakit.TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof Ariakit.TooltipAnchor>) {
  return <Ariakit.TooltipAnchor data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  gutter = 4,
  children,
  ...props
}: React.ComponentProps<typeof Ariakit.Tooltip>) {
  const store = Ariakit.useTooltipContext();
  const currentPlacement = store?.getState().currentPlacement;

  return (
    <Ariakit.Tooltip
      data-slot="tooltip-content"
      data-placement={currentPlacement}
      gutter={gutter}
      className={cn(
        "bg-foreground text-background z-50 rounded-md px-3 py-1.5 text-xs text-balance shadow-md",
        // Base enter/leave animations
        "animate-in fade-in-0 zoom-in-95",
        "data-[leave]:animate-out data-[leave]:fade-out-0 data-[leave]:zoom-out-95",
        // Slide animations based on placement
        "data-[placement^=top]:slide-in-from-bottom-2",
        "data-[placement^=bottom]:slide-in-from-top-2",
        "data-[placement^=left]:slide-in-from-right-2",
        "data-[placement^=right]:slide-in-from-left-2",
        className
      )}
      {...props}
    >
      <Ariakit.TooltipArrow className="fill-foreground" />
      {children}
    </Ariakit.Tooltip>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
