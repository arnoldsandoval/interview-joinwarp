import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";

import { Button } from "@/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";

/**
 * A popup that displays information related to an element when the element
 * receives keyboard focus or the mouse hovers over it.
 *
 * Ariakit's Tooltip components support the `render` prop, allowing you to
 * render tooltips on any element while preserving accessibility features.
 */
const meta: Meta<typeof TooltipContent> = {
  title: "ui/Tooltip",
  component: TooltipContent,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
  },
  args: {
    children: "Add to library",
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Tooltip placement="top">
      <TooltipTrigger>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add</span>
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
} satisfies Meta<typeof TooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the tooltip.
 */
export const Default: Story = {};

/**
 * Use the `render` prop on TooltipTrigger to render the anchor as a custom component.
 * This example shows how to use a Button component as the trigger.
 */
export const WithButtonTrigger: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover me
        </TooltipTrigger>
        <TooltipContent>This is a tooltip on a Button</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

/**
 * Demonstrates using render props with a custom element and multiple tooltips.
 */
export const UsingRenderProp: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip placement="top">
          <TooltipTrigger
            render={(props) => (
              <button
                {...props}
                type="button"
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-900 font-[Comic_Sans_MS]"
              >
                Custom Button
              </button>
            )}
          />
          <TooltipContent>Custom styled button with tooltip</TooltipContent>
        </Tooltip>

        <Tooltip placement="bottom">
          <TooltipTrigger
            render={(props) => (
              <button
                {...props}
                type="button"
                className="px-3 py-1 border border-dashed rounded cursor-help font-[Comic_Sans_MS]"
              >
                Help?
              </button>
            )}
          />
          <TooltipContent>This is help text in a tooltip</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Multiple tooltips with different placements and content.
 */
export const Placements: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-8 p-8">
        <Tooltip placement="top">
          <TooltipTrigger render={<Button variant="outline" />}>
            Top
          </TooltipTrigger>
          <TooltipContent>Appears on top</TooltipContent>
        </Tooltip>

        <div className="flex gap-8">
          <Tooltip placement="left">
            <TooltipTrigger render={<Button variant="outline" />}>
              Left
            </TooltipTrigger>
            <TooltipContent>Appears on left</TooltipContent>
          </Tooltip>

          <Tooltip placement="right">
            <TooltipTrigger render={<Button variant="outline" />}>
              Right
            </TooltipTrigger>
            <TooltipContent>Appears on right</TooltipContent>
          </Tooltip>
        </div>

        <Tooltip placement="bottom">
          <TooltipTrigger render={<Button variant="outline" />}>
            Bottom
          </TooltipTrigger>
          <TooltipContent>Appears on bottom</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

// Note: Hover interaction tests for tooltips are skipped because userEvent.hover()
// doesn't reliably trigger Ariakit's native hover handlers in the test environment.
// Manual testing in Storybook confirms tooltips work correctly on hover.
