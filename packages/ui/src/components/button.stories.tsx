import { Button } from "@/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, GitBranch, Loader2 } from "lucide-react";
import { fn } from "storybook/test";

/**
 * Displays a button or a component that looks like a button.
 */
const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
      if: { arg: "variant", neq: "link" },
    },
    children: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
  parameters: {
    layout: "centered",
  },
  args: {
    variant: "default",
    size: "default",
    children: "Button",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the button, used for primary actions and commands.
 */
export const Default: Story = {};

/**
 * Use the `outline` button to reduce emphasis on secondary actions, such as
 * canceling or dismissing a dialog.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

/**
 * Use the `ghost` button is minimalistic and subtle, for less intrusive
 * actions.
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

/**
 * Use the `secondary` button to call for less emphasized actions, styled to
 * complement the primary button while being less conspicuous.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Use the `destructive` button to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

/**
 * Use the `link` button to reduce emphasis on tertiary actions, such as
 * hyperlink or navigation, providing a text-only interactive element.
 */
export const Link: Story = {
  args: {
    variant: "link",
  },
};

/**
 * A button with a loading spinner.
 */
export const Spinner: Story = {
  render: (args) => (
    <Button {...args} disabled>
      <Loader2 className="animate-spin" />
      Submit
    </Button>
  ),
  args: {
    size: "sm",
    variant: "outline",
  },
};

/**
 * A button with an icon. The spacing between the icon and text is automatically adjusted.
 */
export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <GitBranch /> New Branch
    </Button>
  ),
  args: {
    variant: "outline",
    size: "sm",
  },
};

/**
 * Use the `sm` size for a smaller button, suitable for interfaces needing
 * compact elements without sacrificing usability.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Use the `lg` size for a larger button, offering better visibility and
 * easier interaction for users.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * An icon button using the icon size.
 */
export const Icon: Story = {
  render: (args) => (
    <Button {...args} aria-label="Submit">
      <ArrowUpRight />
    </Button>
  ),
  args: {
    variant: "outline",
    size: "icon",
  },
};

/**
 * Add the `disabled` prop to prevent interactions with the button.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * A rounded button using the rounded-full class.
 */
export const Rounded: Story = {
  render: (args) => (
    <Button {...args} className="rounded-full" aria-label="Submit">
      <ArrowUpRight />
    </Button>
  ),
  args: {
    variant: "outline",
    size: "icon",
  },
};

/**
 * Size variations showing small, medium, and large buttons with icons.
 */
export const SizeVariations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={fn()}>
          Small
        </Button>
        <Button
          size="icon-sm"
          aria-label="Submit"
          variant="outline"
          onClick={fn()}
        >
          <ArrowUpRight />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={fn()}>
          Default
        </Button>
        <Button
          size="icon"
          aria-label="Submit"
          variant="outline"
          onClick={fn()}
        >
          <ArrowUpRight />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="lg" variant="outline" onClick={fn()}>
          Large
        </Button>
        <Button
          size="icon-lg"
          aria-label="Submit"
          variant="outline"
          onClick={fn()}
        >
          <ArrowUpRight />
        </Button>
      </div>
    </div>
  ),
};

/**
 * Use the `render` prop to render the button as a link while maintaining
 * all button styles and accessibility features.
 */
export const AsLink: Story = {
  args: {
    render: <a href="https://www.google.com" />,
    children: "Visit Google",
  },
};

/**
 * Use the `render` prop with a router link component. This pattern is useful
 * for navigation links that need button styling.
 */
export const UsingRenderProp: Story = {
  render: (args) => {
    // Example router link component (like Next.js Link or React Router Link)
    const RouterLink = ({ href, ...props }: any) => (
      <a href={href} {...props} />
    );

    return (
      <Button {...args} render={<RouterLink href="/dashboard" />}>
        Go to Dashboard
      </Button>
    );
  },
  args: {
    variant: "secondary",
  },
};

/**
 * Demonstrates using the `render` prop with different variants to create
 * link-styled buttons that navigate.
 */
export const NavigationButtons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button render={<a href="#home" />} variant="default">
        Home
      </Button>
      <Button render={<a href="#about" />} variant="secondary">
        About
      </Button>
      <Button render={<a href="#contact" />} variant="ghost">
        Contact
      </Button>
    </div>
  ),
};
