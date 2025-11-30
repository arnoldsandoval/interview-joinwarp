import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { Toaster } from "@/components/sonner";

/**
 * An opinionated toast component for React.
 */
const meta = {
  title: "ui/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    position: "bottom-right",
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: new Date().toLocaleString(),
            action: {
              label: "Undo",
              onClick: fn(),
            },
          })
        }
      >
        Show Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default sonner toast.
 */
export const Default: Story = {};

/**
 * Simple toast notification.
 */
export const Simple: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() => toast("Event has been created.")}
      >
        Show Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Toast with description.
 */
export const WithDescription: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
          })
        }
      >
        Show Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Toast with action button.
 */
export const WithAction: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: fn(),
            },
          })
        }
      >
        Show Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Success toast variant.
 */
export const Success: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() => toast.success("Event has been created")}
      >
        Show Success Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Error toast variant.
 */
export const Error: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() => toast.error("Event has not been created")}
        variant="destructive"
      >
        Show Error Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Warning toast variant.
 */
export const Warning: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() => toast.warning("Event has a warning")}
        variant="outline"
      >
        Show Warning Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Info toast variant.
 */
export const Info: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() => toast.info("Be at the area 10 minutes before the event time")}
        variant="secondary"
      >
        Show Info Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Loading toast with promise handling.
 */
export const Loading: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() => {
          const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));
          
          toast.promise(promise, {
            loading: 'Loading...',
            success: () => {
              return `Event has been created`;
            },
            error: 'Error',
          });
        }}
      >
        Show Loading Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Custom JSX content in toast.
 */
export const Custom: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <Button
        onClick={() =>
          toast(
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Event has been created</span>
            </div>
          )
        }
      >
        Show Custom Toast
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Rich colors theme variant.
 */
export const RichColors: Story = {
  args: {
    richColors: true,
  },
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center flex-wrap gap-2">
      <Button
        onClick={() => toast.success("Success with rich colors")}
        variant="default"
      >
        Success
      </Button>
      <Button
        onClick={() => toast.error("Error with rich colors")}
        variant="destructive"
      >
        Error
      </Button>
      <Button
        onClick={() => toast.warning("Warning with rich colors")}
        variant="outline"
      >
        Warning
      </Button>
      <Button
        onClick={() => toast.info("Info with rich colors")}
        variant="secondary"
      >
        Info
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Different toast positions.
 */
export const Positions: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center flex-wrap gap-2">
      <Button
        onClick={() => {
          toast("Top Left", { position: "top-left" });
        }}
        variant="outline"
      >
        Top Left
      </Button>
      <Button
        onClick={() => {
          toast("Top Center", { position: "top-center" });
        }}
        variant="outline"
      >
        Top Center
      </Button>
      <Button
        onClick={() => {
          toast("Top Right", { position: "top-right" });
        }}
        variant="outline"
      >
        Top Right
      </Button>
      <Button
        onClick={() => {
          toast("Bottom Left", { position: "bottom-left" });
        }}
        variant="outline"
      >
        Bottom Left
      </Button>
      <Button
        onClick={() => {
          toast("Bottom Center", { position: "bottom-center" });
        }}
        variant="outline"
      >
        Bottom Center
      </Button>
      <Button
        onClick={() => {
          toast("Bottom Right", { position: "bottom-right" });
        }}
        variant="outline"
      >
        Bottom Right
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

export const ShouldShowToast: Story = {
  name: "when clicking Show Toast button, should show a toast",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const triggerBtn = await canvasBody.findByRole("button", {
      name: /show/i,
    });

    await step("create a toast", async () => {
      await userEvent.click(triggerBtn);
      await waitFor(() =>
        expect(canvasBody.queryByRole("listitem")).toBeInTheDocument()
      );
    });

    await step("create more toasts", async () => {
      await userEvent.click(triggerBtn);
      await userEvent.click(triggerBtn);
      await waitFor(() =>
        expect(canvasBody.getAllByRole("listitem")).toHaveLength(3)
      );
    });
  },
};

export const ShouldCloseToast: Story = {
  name: "when clicking the action button, should close the toast",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const triggerBtn = await canvasBody.findByRole("button", {
      name: /show toast/i,
    });

    await step("create a toast", async () => {
      await userEvent.click(triggerBtn);
    });

    await step("close the toast via action button", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /undo/i })
      );
      await waitFor(() =>
        expect(canvasBody.queryByRole("listitem")).not.toBeInTheDocument()
      );
    });
  },
};
