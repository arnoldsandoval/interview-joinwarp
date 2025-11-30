"use client";
import * as Ariakit from "@ariakit/react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";
import { createContext, useContext } from "react";

import { cn } from "../lib/utils";

// Context for radio group value management
interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({});

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof Ariakit.MenuProvider>) {
  return <Ariakit.MenuProvider data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <div data-slot="dropdown-menu-portal">{children}</div>;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof Ariakit.MenuButton>) {
  return <Ariakit.MenuButton data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  gutter = 4,
  ...props
}: React.ComponentProps<typeof Ariakit.Menu> & {
  gutter?: number;
}) {
  return (
    <Ariakit.Menu
      data-slot="dropdown-menu-content"
      gutter={gutter}
      className={cn(
        "bg-popover text-popover-foreground opacity-0 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100 data-[leave]:opacity-0 data-[leave]:scale-95 transition-all duration-150 z-50 min-w-[8rem] rounded-2xl border p-1 shadow-md",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof Ariakit.MenuGroup>) {
  return <Ariakit.MenuGroup data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Ariakit.MenuItem> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <Ariakit.MenuItem
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "data-[active-item]:bg-accent data-[active-item]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[active-item]:bg-destructive/10 dark:data-[variant=destructive]:data-[active-item]:bg-destructive/20 data-[variant=destructive]:data-[active-item]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none aria-[disabled]:pointer-events-none aria-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Ariakit.MenuItemCheckbox>) {
  return (
    <Ariakit.MenuItemCheckbox
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "data-[active-item]:bg-accent data-[active-item]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none aria-[disabled]:pointer-events-none aria-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="absolute inset-y-0 left-2 flex items-center justify-center">
        <Ariakit.MenuItemCheck className="flex items-center justify-center">
          <CheckIcon className="size-4" />
        </Ariakit.MenuItemCheck>
      </span>
      {children}
    </Ariakit.MenuItemCheckbox>
  );
}

function DropdownMenuRadioGroup({
  value,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<typeof Ariakit.MenuGroup> & {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <Ariakit.MenuGroup data-slot="dropdown-menu-radio-group" {...props}>
        {children}
      </Ariakit.MenuGroup>
    </RadioGroupContext.Provider>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  value,
  onClick,
  ...props
}: React.ComponentProps<typeof Ariakit.MenuItemRadio> & {
  value: string;
}) {
  const { value: groupValue, onValueChange } = useContext(RadioGroupContext);
  const isChecked = groupValue === value;

  return (
    <Ariakit.MenuItemRadio
      data-slot="dropdown-menu-radio-item"
      value={value}
      checked={isChecked}
      className={cn(
        "data-[active-item]:bg-accent rounded-lg data-[active-item]:text-accent-foreground relative flex cursor-default items-center gap-2 py-1.5 pr-2 pl-8 text-sm outline-hidden select-none aria-[disabled]:pointer-events-none aria-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(e) => {
        onValueChange?.(value);
        onClick?.(e);
      }}
      {...props}
    >
      <span className="absolute inset-y-0 left-2 flex items-center justify-center">
        <Ariakit.MenuItemCheck className="flex items-center justify-center">
          <CircleIcon className="size-2 fill-current" />
        </Ariakit.MenuItemCheck>
      </span>
      {children}
    </Ariakit.MenuItemRadio>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof Ariakit.MenuGroupLabel> & {
  inset?: boolean;
}) {
  return (
    <Ariakit.MenuGroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Ariakit.MenuSeparator>) {
  return (
    <Ariakit.MenuSeparator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  const parentMenu = Ariakit.useMenuContext();
  return (
    <Ariakit.MenuProvider data-slot="dropdown-menu-sub" parent={parentMenu}>
      {children}
    </Ariakit.MenuProvider>
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof Ariakit.MenuButton> & {
  inset?: boolean;
}) {
  return (
    <Ariakit.MenuButton
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "data-[active-item]:bg-accent data-[active-item]:text-accent-foreground data-[open]:bg-accent data-[open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      render={<div />}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </Ariakit.MenuButton>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof Ariakit.Menu>) {
  return (
    <Ariakit.Menu
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground opacity-0 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100 data-[leave]:opacity-0 data-[leave]:scale-95 transition-all duration-150 z-50 min-w-[8rem] rounded-2xl border p-1.5 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
