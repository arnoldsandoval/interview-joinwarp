import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Label } from "@/components/label";
import { Toaster } from "@/components/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { expect, fn, userEvent, within } from "storybook/test";
import { z } from "zod";

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta: Meta<typeof Checkbox> = {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    id: "terms",
    disabled: false,
    onChange: fn(),
  },
  render: (args) => (
    <div className="flex space-x-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Accept terms and conditions</Label>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the checkbox.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the checkbox.
 */
export const Disabled: Story = {
  args: {
    id: "disabled-terms",
    disabled: true,
  },
};

/**
 * Various complex examples of the checkbox.
 */
export const ComplexExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Checkbox id="terms2" onChange={fn()} />
        <div className="grid gap-2">
          <Label htmlFor="terms2">Accept terms and conditions</Label>
          <p className="text-muted-foreground text-sm">
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>

      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          id="notifications-enabled"
          onChange={fn()}
          className="peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white dark:peer-checked:border-blue-700 dark:peer-checked:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            Enable notifications
          </p>
          <p className="text-muted-foreground text-sm">
            You can enable or disable notifications at any time.
          </p>
        </div>
      </Label>
    </div>
  ),
};

/**
 * Multiple checkboxes in a form context.
 */

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export const FormMultiple: Story = {
  name: "Form",
  render: () => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        items: ["recents", "home"],
      },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
      toast("You submitted the following values", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-foreground p-4">
            <code className="text-background">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Sidebar</FormLabel>
                    <FormDescription>
                      Select the items you want to display in the sidebar.
                    </FormDescription>
                  </div>
                  {items.map((item) => (
                    <FormField
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl
                              render={
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onChange={(event) => {
                                    fn()(event);
                                    const checked = event.target.checked;
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              }
                            />

                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <Toaster />
      </>
    );
  },
};

export const ShouldToggleCheck: Story = {
  name: "when the checkbox is clicked, should toggle between checked and not checked",
  tags: ["!dev", "!autodocs"],
  args: {
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox, { delay: 100 });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox, { delay: 100 });
    expect(checkbox).toBeChecked();
  },
};

export const ShouldToggleWhenVisualDivClicked: Story = {
  name: "when the visual div is clicked, should toggle checkbox state",
  tags: ["!dev", "!autodocs"],
  args: {
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.getByRole("checkbox");
    const visualDiv = canvasElement.querySelector(
      '[aria-hidden="true"]'
    ) as HTMLElement;

    expect(checkbox).not.toBeChecked();

    // Click the visual div directly
    await userEvent.click(visualDiv);
    expect(checkbox).toBeChecked();

    await userEvent.click(visualDiv);
    expect(checkbox).not.toBeChecked();
  },
};

export const ShouldNotToggleWhenDisabledVisualDivClicked: Story = {
  name: "when disabled visual div is clicked, should not toggle",
  tags: ["!dev", "!autodocs"],
  args: {
    disabled: true,
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.getByRole("checkbox");
    const visualDiv = canvasElement.querySelector(
      '[aria-hidden="true"]'
    ) as HTMLElement;

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeDisabled();

    // Click the visual div - should not change state when disabled
    await userEvent.click(visualDiv);
    expect(checkbox).not.toBeChecked();
  },
};

export const RefForwardingWithCallbackRef: Story = {
  name: "ref forwarding works with callback refs",
  tags: ["!dev", "!autodocs"],
  render: () => {
    const [inputElement, setInputElement] =
      React.useState<HTMLInputElement | null>(null);

    return (
      <div className="flex space-x-2">
        <Checkbox
          id="callback-ref-test"
          onChange={fn()}
          ref={(node) => setInputElement(node)}
        />
        <Label htmlFor="callback-ref-test">
          Input accessible: {inputElement ? "Yes" : "No"}
        </Label>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = await canvas.getByText(/Input accessible:/);

    // Verify parent components can access the input element via callback ref
    expect(label).toHaveTextContent("Yes");
  },
};

export const RefForwardingWithRefObject: Story = {
  name: "ref forwarding works with useRef objects",
  tags: ["!dev", "!autodocs"],
  render: () => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    const [isRefSet, setIsRefSet] = React.useState(false);

    React.useEffect(() => {
      // Check if ref is set after render
      setIsRefSet(!!checkboxRef.current);
    });

    return (
      <div className="flex space-x-2">
        <Checkbox id="useref-test" onChange={fn()} ref={checkboxRef} />
        <Label htmlFor="useref-test">
          Ref populated: {isRefSet ? "Yes" : "No"}
        </Label>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = await canvas.getByText(/Ref populated:/);

    // Verify parent components can access the input element via ref object
    expect(label).toHaveTextContent("Yes");
  },
};
