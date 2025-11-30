import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, fn, userEvent, within } from "storybook/test";

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta = {
  title: "ui/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {},

  render: (args) => (
    <div className="flex min-h-68 justify-center space-x-2">
      <Popover>
        <PopoverTrigger
          variant="outline"
          onClick={fn()}
          render={(props: React.ComponentProps<typeof Button>) => (
            <Button {...props}>Open popover</Button>
          )}
        >
          Open popover
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input
                  id="maxWidth"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  defaultValue="25px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input
                  id="maxHeight"
                  defaultValue="none"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the popover.
 */
export const Default: Story = {
  args: {
    children: null,
  },
};

/**
 * Demonstrates different placement options for the popover.
 */
export const Placements: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="grid grid-cols-3 p-[100px] place-items-center gap-8">
      {[
        "top-start",
        "top",
        "top-end",
        "left",
        null,
        "right",
        "bottom-start",
        "bottom",
        "bottom-end",
      ].map((placement) => {
        if (placement === null) {
          return <div key={placement} className="h-8" />;
        }
        return (
          <div key={placement}>
            <Popover placement={placement as any}>
              <PopoverTrigger
                render={(props: React.ComponentProps<typeof Button>) => (
                  <Button
                    {...props}
                    variant="secondary"
                    size="sm"
                    className="w-24"
                    onClick={(e) => {
                      fn()(e);
                      props.onClick?.(e);
                    }}
                  >
                    {placement}
                  </Button>
                )}
              />
              <PopoverContent className="w-48">
                <div className="text-sm">
                  <p className="font-medium">Placement</p>
                  <p className="text-muted-foreground">{placement}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      })}
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};

/**
 * Demonstrates different offset options for the popover.
 */
export const WithOffsets: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="flex gap-8 py-[100px]">
      {[0, 4, 8, 16].map((offset) => (
        <div key={offset}>
          <Popover>
            <PopoverTrigger
              render={(props: React.ComponentProps<typeof Button>) => (
                <Button
                  {...props}
                  variant="secondary"
                  onClick={(e) => {
                    fn()(e);
                    props.onClick?.(e);
                  }}
                >
                  {offset}px offset
                </Button>
              )}
            />
            <PopoverContent sideOffset={offset}>
              <div className="text-sm">
                <p className="font-medium">Offset Demo</p>
                <p className="text-muted-foreground">
                  This popover has {offset}px offset from the trigger
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};

export const ShouldOpenClose: Story = {
  name: "when clicking the trigger, should open and close the popover",
  tags: ["!dev", "!autodocs"],
  args: {
    children: null,
  },
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("click the trigger to open the popover", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      expect(await canvasBody.findByRole("dialog")).toBeInTheDocument();
    });

    await step("click the trigger to close the popover", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      // With Ariakit, check that popover is not visible
      const dialog = canvasBody.queryByRole("dialog");
      expect(dialog).not.toBeVisible();
    });
  },
};
