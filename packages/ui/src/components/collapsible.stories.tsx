import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

import { Button } from "@/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible";
import { expect, fn, userEvent } from "storybook/test";

/**
 * An interactive component which expands/collapses a panel.
 */
const meta = {
  title: "ui/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultOpen: false,
  },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
      <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution
        required.
      </CollapsibleContent>
    </Collapsible>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the collapsible.
 */
export const Default: Story = {};

/**
 * Use the `defaultOpen` prop to start expanded.
 */
export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
};

/**
 * A collapsible component exactly as shown in shadcn documentation.
 * This demonstrates the styled demo with Button integration.
 */
export const Demo: Story = {
  render: () => (
    <Collapsible className="flex w-[350px] flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger
          render={(props: React.ComponentProps<typeof Button>) => (
            <Button
              {...props}
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => {
                fn()(e);
                props.onClick?.(e);
              }}
            />
          )}
        >
          <ChevronsUpDown />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const ShouldOpenClose: Story = {
  name: "when collapsable trigger is clicked, should show content",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const trigger = await canvas.findByRole("button");

    await step("Open the collapsible", async () => {
      await userEvent.click(trigger, { delay: 100 });
      expect(canvas.queryByText(/yes/i, { exact: true })).toBeVisible();
    });

    await step("Close the collapsible", async () => {
      await userEvent.click(trigger, { delay: 100 });
      // With Ariakit, content is hidden but still in DOM, check aria-expanded instead
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};
