import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useAccordionContext,
} from "@/components/accordion";

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta = {
  title: "ui/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      description: "Type of accordion behavior",
      options: ["single", "multiple"],
    },
    collapsible: {
      control: "boolean",
      description: "Can an open accordion be collapsed using the trigger",
      if: { arg: "type", eq: "single" },
    },
    defaultValue: {
      control: "text",
      description: "Default open item(s)",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    type: "single",
    collapsible: true,
    disabled: false,
    onValueChange: fn(),
  },
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components'
          aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default behavior of the accordion allows only one item to be open.
 */
export const Default: Story = {};

/**
 * In single mode, only one accordion item can be open at a time.
 * Opening a new item automatically closes the previously opened one.
 */
export const Single: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I have multiple items open?</AccordionTrigger>
        <AccordionContent>
          No, in single mode only one item can be open at a time. Try opening
          another item and this one will automatically close.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>This item is open by default</AccordionTrigger>
        <AccordionContent>
          This item starts open because of the defaultValue prop. When you click
          another item, this will close automatically.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Try opening this one</AccordionTrigger>
        <AccordionContent>
          When you open this item, the previous one will close automatically.
          That's how single mode works!
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * In multiple mode, you can have several accordion items open simultaneously.
 * Each item can be toggled independently.
 */
export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-3"],
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>I can stay open!</AccordionTrigger>
        <AccordionContent>
          In multiple mode, I can stay open while you open other items. Try it!
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Open me too</AccordionTrigger>
        <AccordionContent>
          Go ahead and open me - the other items will stay open. Multiple mode
          allows all items to be open at once.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>We can all be open together</AccordionTrigger>
        <AccordionContent>
          This demonstrates how multiple mode works - each accordion item
          operates independently.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * When collapsible is false in single mode, there must always be one item open.
 * Clicking the open item won't close it.
 */
export const NonCollapsible: Story = {
  args: {
    type: "single",
    collapsible: false,
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>I can't be collapsed</AccordionTrigger>
        <AccordionContent>
          With collapsible=false, clicking me won't close me. There must always
          be one item open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Click me to open</AccordionTrigger>
        <AccordionContent>
          When you open me, the previous item will close, but I can't be
          collapsed by clicking me again.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Always one open</AccordionTrigger>
        <AccordionContent>
          This ensures there's always content visible to the user.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * When disabled is true, all accordion triggers become non-interactive.
 * They show reduced opacity and cannot be clicked.
 */
export const Disabled: Story = {
  args: {
    type: "single",
    disabled: true,
    defaultValue: "item-2",
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>This trigger is disabled</AccordionTrigger>
        <AccordionContent>
          This content won't be accessible because the trigger is disabled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>This one is also disabled</AccordionTrigger>
        <AccordionContent>
          Even though this item is open by default, you can't close it when
          disabled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>All triggers are disabled</AccordionTrigger>
        <AccordionContent>
          When the accordion is disabled, all interactions are prevented.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const ShouldOnlyOpenOneWhenSingleType: Story = {
  name: "when accordions are clicked, should open only one item at a time",
  args: {
    type: "single" as const,
  },
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accordions = await canvas.getAllByRole("button");

    // Open the tabs one at a time
    for (const trigger of accordions) {
      await userEvent.click(trigger);
      await waitFor(async () => {
        const expandedButtons = canvas.getAllByRole("button", {
          expanded: true,
        });
        return expect(expandedButtons.length).toBe(1);
      });
    }

    // Close the last opened tab
    await userEvent.click(accordions[accordions.length - 1]);
    await waitFor(async () => {
      const expandedButtons = canvas.queryAllByRole("button", {
        expanded: true,
      });
      return expect(expandedButtons.length).toBe(0);
    });
  },
};

export const ShouldOpenAllWhenMultipleType: Story = {
  name: "when accordions are clicked, should open all items one at a time",
  args: {
    type: "multiple",
  },
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accordions = await canvas.getAllByRole("button");

    // Open all tabs one at a time
    for (let i = 0; i < accordions.length; i++) {
      await userEvent.click(accordions[i]);
      await waitFor(async () => {
        const expandedButtons = canvas.getAllByRole("button", {
          expanded: true,
        });
        return expect(expandedButtons.length).toBe(i + 1);
      });
    }

    // Close all tabs one at a time
    for (let i = accordions.length - 1; i > 0; i--) {
      await userEvent.click(accordions[i]);
      await waitFor(async () => {
        const expandedButtons = canvas.getAllByRole("button", {
          expanded: true,
        });
        return expect(expandedButtons.length).toBe(i);
      });
    }

    // Close the last opened tab
    await userEvent.click(accordions[0]);
    await waitFor(async () => {
      const expandedButtons = canvas.queryAllByRole("button", {
        expanded: true,
      });
      return expect(expandedButtons.length).toBe(0);
    });
  },
};

/**
 * Use the `render` prop to render accordion triggers as links while maintaining
 * all accordion styles and accessibility features.
 */
export const AsLinks: Story = {
  render: () => (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger render={<a href="#faq1" />}>
          Frequently Asked Question 1
        </AccordionTrigger>
        <AccordionContent>
          This is the answer to the first frequently asked question.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger render={<a href="#faq2" />}>
          Frequently Asked Question 2
        </AccordionTrigger>
        <AccordionContent>
          This is the answer to the second frequently asked question.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Use the `render` prop with a router link component for navigation.
 */
export const UsingRenderProp: Story = {
  render: () => {
    // Example router link component (like Next.js Link or React Router Link)
    const RouterLink = ({ href, ...props }: any) => (
      <a href={href} {...props} />
    );

    return (
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger
            render={<RouterLink href="/docs/getting-started" />}
          >
            Getting Started
          </AccordionTrigger>
          <AccordionContent>
            Learn how to get started with our component library.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger render={<RouterLink href="/docs/components" />}>
            Components
          </AccordionTrigger>
          <AccordionContent>
            Explore all available components and their usage.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
};

/**
 * Component that deliberately calls useAccordionContext outside of Accordion context
 * to trigger the error case for test coverage
 */
const InvalidAccordionUsage = () => {
  try {
    useAccordionContext(); // This should throw our custom error
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
  name: "Accordion components should throw error when used outside context",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: { disable: true }, // Disable a11y testing for error demonstration
  },
  render: () => (
    <div data-testid="context-test" className="p-4 border border-red-200 bg-red-50 rounded">
      <h3 className="font-semibold text-red-800 mb-2">Context Error Test</h3>
      <p className="text-red-700 text-sm mb-2">
        If AccordionItem or AccordionTrigger components are used outside of an Accordion component,
        they will throw an error. This component demonstrates that behavior:
      </p>
      <InvalidAccordionUsage />
      <p className="text-red-700 text-xs mt-2">
        The error above validates that useAccordionContext properly throws when context is null.
      </p>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("verify context error is thrown and caught", async () => {
      const errorDiv = canvas.getByTestId("error-caught");
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv).toHaveTextContent("Accordion components must be used within an Accordion");
    });
  },
};
