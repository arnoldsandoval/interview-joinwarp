"use client";
import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "../lib/utils";

// Context to manage avatar state
interface AvatarContextValue {
  imageLoadingStatus: "idle" | "loading" | "loaded" | "error";
  setImageLoadingStatus: (
    status: "idle" | "loading" | "loaded" | "error"
  ) => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("Avatar components must be used within Avatar");
  }
  return context;
}

function Avatar({ className, ...props }: ComponentProps<"div">) {
  const [imageLoadingStatus, setImageLoadingStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  return (
    <AvatarContext.Provider
      value={{ imageLoadingStatus, setImageLoadingStatus }}
    >
      <div
        data-slot="avatar"
        className={cn(
          "relative flex size-20 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

function AvatarImage({ src, alt, className, ...props }: ComponentProps<"img">) {
  const { imageLoadingStatus, setImageLoadingStatus } = useAvatarContext();

  useEffect(() => {
    if (!src || typeof src !== "string") {
      setImageLoadingStatus("error");
      return;
    }

    setImageLoadingStatus("loading");

    const img = new Image();
    img.onload = () => setImageLoadingStatus("loaded");
    img.onerror = () => setImageLoadingStatus("error");
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, setImageLoadingStatus]);

  if (imageLoadingStatus !== "loaded") {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  delayMs = 0,
  children,
  ...props
}: ComponentProps<"div"> & { delayMs?: number }) {
  const { imageLoadingStatus } = useAvatarContext();
  const [canRender, setCanRender] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => setCanRender(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  const shouldRender = imageLoadingStatus !== "loaded" && canRender;

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted font-semibold leading-tight flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Avatar, AvatarFallback, AvatarImage, useAvatarContext };
