import { Checkbox as AriakitCheckbox } from "@ariakit/react";
import { CheckIcon } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { cn } from "../lib/utils";

const Checkbox = forwardRef<
  ElementRef<typeof AriakitCheckbox>,
  ComponentPropsWithoutRef<typeof AriakitCheckbox>
>(({ className, ...props }, ref) => {
  const internalRef = useRef<HTMLInputElement>(null);

  const mergedRef = useMemo(() => {
    return (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
  }, [ref]);

  const handleVisualClick = useCallback(
    (event: React.MouseEvent) => {
      if (internalRef.current && !props.disabled) {
        event.preventDefault();
        event.stopPropagation();
        internalRef.current.click();
      }
    },
    [props.disabled]
  );

  return (
    <div className="relative">
      <AriakitCheckbox ref={mergedRef} className="peer sr-only" {...props} />
      <div
        aria-hidden="true"
        onClick={handleVisualClick}
        className={cn(
          // Base styles
          "size-5 shrink-0 rounded-sm border border-input bg-background shadow-xs",
          "flex items-center justify-center text-current cursor-pointer transition-all",
          // Focus styles
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
          // Disabled styles
          "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
          // Checked styles
          "peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary",
          // Icon visibility
          "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
          className
        )}
      >
        <CheckIcon className="size-4 transition-opacity" />
      </div>
    </div>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
