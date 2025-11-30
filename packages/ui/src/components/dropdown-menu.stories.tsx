import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Plus, PlusCircle, Search, UserPlus } from "lucide-react";
import * as React from "react";
import { expect, userEvent, within } from "storybook/test";

import {
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
} from "@/components/dropdown-menu";

/**
 * Displays a menu to the user — such as a set of actions or functions —
 * triggered by a button.
 */
const meta = {
  title: "ui/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    setValues: { action: "setValues" },
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the dropdown menu.
 */
export const Default: Story = {};

/**
 * A dropdown menu with shortcuts.
 */
export const WithShortcuts: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Controls</DropdownMenuLabel>
        <DropdownMenuItem>
          Back
          <DropdownMenuShortcut>⌘[</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Forward
          <DropdownMenuShortcut>⌘]</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with submenus.
 */
export const WithSubmenus: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem>
          <Search className="mr-2 size-4" />
          <span>Search</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Plus className="mr-2 size-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 size-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 size-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 size-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with radio items.
 */
export const WithRadioItems: Story = {
  render: (args) => {
    const [values, setValues] = React.useState({ status: "warning" });

    return (
      <DropdownMenu
        {...args}
        values={values}
        setValues={(newValues) => {
          setValues(newValues);
          args.setValues?.(newValues);
        }}
      >
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuLabel inset>Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem name="status" value="info">
              Info
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem name="status" value="warning">
              Warning
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem name="status" value="error">
              Error
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * A dropdown menu with checkboxes.
 */
export const WithCheckboxes: Story = {
  render: (args) => {
    const [values, setValues] = React.useState({ settings: ["autosave"] });

    return (
      <DropdownMenu
        {...args}
        values={values}
        setValues={(newValues) => {
          setValues(newValues);
          args.setValues?.(newValues);
        }}
      >
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuCheckboxItem name="settings" value="autosave">
            Autosave
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem name="settings" value="show-comments">
            Show Comments
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const ShouldOpenClose: Story = {
  name: "when clicking an item, should close the dropdown menu",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);

    await step("Open the dropdown menu", async () => {
      await userEvent.click(await body.findByRole("button", { name: /open/i }));
      expect(await body.findByRole("menu")).toBeInTheDocument();
    });
    const items = await body.findAllByRole("menuitem");
    expect(items).toHaveLength(4);

    await step("Click the first menu item", async () => {
      await userEvent.click(items[0], { delay: 100 });
    });
  },
};
