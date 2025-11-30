import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  useAvatarContext,
} from "@/components/avatar";

/**
 * An image element with a fallback for representing the user.
 */
const meta = {
  title: "ui/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * An avatar with a fallback.
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/arnoldsandoval.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar that shows fallback when image fails to load.
 */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.png" alt="Broken" />
      <AvatarFallback>BL</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with fallback delay to prevent flashing.
 */
export const FallbackWithDelay: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.png" alt="Broken" />
      <AvatarFallback delayMs={600}>DL</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with custom fallback content.
 */
export const CustomFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.png" alt="Broken" />
      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
        <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatars in different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback className="text-xs">S</AvatarFallback>
      </Avatar>
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback className="text-sm">M</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback className="text-lg">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar group showcasing multiple avatars.
 */
export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar>
        <AvatarImage src="https://github.com/okta.png" alt="Okta" />
        <AvatarFallback>OK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://github.com/dapperlabs.png"
          alt="Dapper Labs"
        />
        <AvatarFallback>DL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/ottiinc.png" alt="Otti" />
        <AvatarFallback>OT</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://github.com/stealth--startup.png"
          alt="Stealth"
        />
        <AvatarFallback>ST</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/arnoldsandoval.png" alt="Warp" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar demonstrating the delayMs prop as documented in Radix API.
 * Shows the difference between immediate and delayed fallback rendering.
 */
export const DelayComparison: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src="https://slow-loading-image.png" alt="Slow" />
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Immediate</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src="https://slow-loading-image.png" alt="Slow" />
          <AvatarFallback delayMs={600}>DL</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">600ms delay</span>
      </div>
    </div>
  ),
};

/**
 * Avatar with no src to test error path.
 */
export const NoSrc: Story = {
  render: () => (
    <Avatar data-testid="no-src-avatar">
      <AvatarImage alt="No source" />
      <AvatarFallback>NS</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar without image to show fallback-only usage.
 */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Verify image loading and fallback behavior.
 */
export const LoadingBehaviorTest: Story = {
  name: "Image loading should show fallback first, then image when loaded",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar data-testid="working-avatar">
          <AvatarImage src="https://github.com/shadcn.png" alt="Working" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <span className="text-xs">Working image</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar data-testid="broken-avatar">
          <AvatarImage src="https://broken-url.png" alt="Broken" />
          <AvatarFallback>BR</AvatarFallback>
        </Avatar>
        <span className="text-xs">Broken image</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar data-testid="no-image-avatar">
          <AvatarFallback>NO</AvatarFallback>
        </Avatar>
        <span className="text-xs">No image</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("should show fallback for broken image", async () => {
      const brokenAvatar = canvas.getByTestId("broken-avatar");
      const fallback = within(brokenAvatar).getByText("BR");
      expect(fallback).toBeInTheDocument();
    });

    await step("should show fallback for no image", async () => {
      const noImageAvatar = canvas.getByTestId("no-image-avatar");
      const fallback = within(noImageAvatar).getByText("NO");
      expect(fallback).toBeInTheDocument();
    });

    await step("should eventually show image for working URL", async () => {
      const workingAvatar = canvas.getByTestId("working-avatar");
      // Wait for image to load
      await waitFor(
        () => {
          const img = within(workingAvatar).queryByRole("img");
          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute("src", "https://github.com/shadcn.png");
        },
        { timeout: 3000 }
      );
    });
  },
};

/**
 * Comprehensive test for edge cases and cleanup behavior.
 */
export const EdgeCasesTest: Story = {
  name: "Avatar should handle edge cases correctly",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <div className="flex gap-4">
      <Avatar data-testid="no-src-avatar">
        <AvatarImage alt="No source" />
        <AvatarFallback>NS</AvatarFallback>
      </Avatar>
      <Avatar data-testid="delay-zero-avatar">
        <AvatarImage src="https://broken-url.png" alt="Broken" />
        <AvatarFallback delayMs={0}>DZ</AvatarFallback>
      </Avatar>
      <Avatar data-testid="delay-short-avatar">
        <AvatarImage src="https://broken-url.png" alt="Broken" />
        <AvatarFallback delayMs={100}>DS</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "should show fallback immediately when no src provided",
      async () => {
        const avatar = canvas.getByTestId("no-src-avatar");
        const fallback = within(avatar).getByText("NS");
        expect(fallback).toBeInTheDocument();
      }
    );

    await step("should show fallback immediately with delayMs=0", async () => {
      const avatar = canvas.getByTestId("delay-zero-avatar");
      const fallback = within(avatar).getByText("DZ");
      expect(fallback).toBeInTheDocument();
    });

    await step("should show fallback after short delay", async () => {
      const avatar = canvas.getByTestId("delay-short-avatar");

      // Wait for the delay to pass and fallback to appear
      await waitFor(
        () => {
          const fallback = within(avatar).queryByText("DS");
          expect(fallback).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  },
};

/**
 * Test error handling when components are used outside Avatar context.
 * This test demonstrates the error that would be thrown, but since we can't
 * actually render components outside their context in Storybook, this
 * serves as documentation of the expected behavior.
 */
/**
 * Component that deliberately calls useAvatarContext outside of Avatar context
 * to trigger the error case for test coverage
 */
const InvalidAvatarUsage = () => {
  try {
    useAvatarContext(); // This should throw our custom error
    return <div>This should not render</div>;
  } catch (error) {
    return (
      <div data-testid="error-caught" className="text-red-500 text-sm">
        Error: {(error as Error).message}
      </div>
    );
  }
};

export const ContextErrorTest: Story = {
  name: "Avatar components should throw error when used outside context",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: { disable: true }, // Disable a11y testing for error demonstration
  },
  render: () => (
    <div
      data-testid="context-test"
      className="p-4 border border-red-200 bg-red-50 rounded"
    >
      <h3 className="font-semibold text-red-800 mb-2">Context Error Test</h3>
      <p className="text-red-700 text-sm mb-2">
        If AvatarImage or AvatarFallback components are used outside of an
        Avatar component, they will throw an error. This component demonstrates
        that behavior:
      </p>
      <InvalidAvatarUsage />
      <p className="text-red-700 text-xs mt-2">
        The error above validates that useAvatarContext properly throws when
        context is null.
      </p>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify context error is thrown and caught", async () => {
      const errorDiv = canvas.getByTestId("error-caught");
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv).toHaveTextContent(
        "Avatar components must be used within Avatar"
      );
    });
  },
};
