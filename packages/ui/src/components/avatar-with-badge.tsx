"use client";
import type { EventType } from "@repo/types";
import type { CSSProperties } from "react";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { eventColors } from "./calendar-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface AvatarWithBadgeProps {
  src?: string;
  alt?: string;
  fallback: string;
  eventType: EventType;
  yearsOfService?: number;
  className?: string;
  tooltip?: string;
}

export function AvatarWithBadge({
  src,
  alt,
  fallback,
  eventType,
  yearsOfService,
  className,
  tooltip,
}: AvatarWithBadgeProps) {
  const colors = eventColors[eventType];
  const showBadge =
    eventType === "time-off" ||
    eventType === "birthday" ||
    eventType === "anniversary";

  if (!showBadge) {
    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger
            render={
              <Avatar
                className={cn(
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
                  className
                )}
              >
                <AvatarImage src={src} alt={alt} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            }
          />
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Avatar className={cn(className)}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    );
  }

  // Badge positioning: badge center is at (100% - offset, 100% - offset)
  // Using the sqrt(2) technique from css-tip.com for perfect corner positioning
  const badgeRadius = 10; // px - radius of the badge circle
  const gap = 2; // px - gap between avatar edge and badge

  // The badge center position from the corner (using geometry for corner positioning)
  // For a badge that sits in the corner, we position it at sqrt(2) * offset from corner
  const cutoutRadius = badgeRadius + gap;

  // Position the gradient center at the badge center location
  // Badge is positioned with bottom/right = -badgeRadius + offset to place it in the corner
  const badgeOffset = badgeRadius - 2; // how far the badge center is from the edge

  // CSS mask: create circular cutout where badge will be
  const maskValue = `radial-gradient(circle ${cutoutRadius}px at calc(100% - ${badgeOffset}px) calc(100% - ${badgeOffset}px), transparent 100%, #000 100%)`;
  const maskStyle: CSSProperties = {
    mask: maskValue,
    WebkitMask: maskValue,
  };

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <div
              className={cn(
                "relative inline-block rounded-full outline-none ",
                className
              )}
            >
              <Avatar
                className="size-full border-3 border-transparent"
                style={maskStyle}
              >
                <AvatarImage src={src} alt={alt} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "absolute flex items-center justify-center rounded-full",
                  colors.bg
                )}
                style={{
                  width: badgeRadius * 2,
                  height: badgeRadius * 2,
                  bottom: -badgeRadius + badgeOffset,
                  right: -badgeRadius + badgeOffset,
                }}
              >
                <BadgeContent
                  eventType={eventType}
                  yearsOfService={yearsOfService}
                />
              </div>
            </div>
          }
        />
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className="size-full border-3 border-muted" style={maskStyle}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full",
          colors.bg
        )}
        style={{
          width: badgeRadius * 2,
          height: badgeRadius * 2,
          bottom: -badgeRadius + badgeOffset,
          right: -badgeRadius + badgeOffset,
        }}
      >
        <BadgeContent eventType={eventType} yearsOfService={yearsOfService} />
      </div>
    </div>
  );
}

function BadgeContent({
  eventType,
  yearsOfService,
}: {
  eventType: EventType;
  yearsOfService?: number;
}) {
  const colors = eventColors[eventType];

  if (eventType === "time-off") {
    return <span className="text-[10px] -ml-0.5 block">✈️</span>;
  }
  if (eventType === "birthday") {
    return <span className="text-xs">🎂</span>;
  }
  if (eventType === "anniversary") {
    return (
      <span className={cn("text-xs font-semibold leading-none", colors.text)}>
        {yearsOfService}
      </span>
    );
  }

  return null;
}
