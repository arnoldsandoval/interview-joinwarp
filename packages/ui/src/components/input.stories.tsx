import type { ComponentProps } from "react";
import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Toaster } from "@/components/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { expect, fn, userEvent } from "storybook/test";
import * as z from "zod";

/**
 * Displays a form input field or a component that looks like an input field.
 */
const meta = {
  title: "ui/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "max-w-xs",
    type: "email",
    placeholder: "Email",
    disabled: false,
    onChange: fn(),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A form input component.
 */
export const Default: Story = {};

/**
 * A file input component.
 */
export const File: Story = {
  args: {
    type: "file",
  },
};

/**
 * A disabled input component.
 */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * An input component with a label.
 */
export const WithLabel: Story = {
  render: (args: ComponentProps<typeof Input>) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input {...args} id="email" type="email" placeholder="Email" />
    </div>
  ),
};

/**
 * An input component with a button.
 */
export const WithButton: Story = {
  render: (args: ComponentProps<typeof Input>) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input {...args} type="email" placeholder="Email" />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
};

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

/**
 * An input component within a form with validation.
 */
export const FormExample: Story = {
  name: "Form",
  render: () => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: "",
      },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    return (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-96 space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
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

export const ShouldEnterText: Story = {
  name: "when user enters text, should see it in the input field",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const input = await canvas.findByPlaceholderText(/email/i);
    const mockedInput = "mocked@shadcn.com";

    await step("focus and type into the input field", async () => {
      await userEvent.click(input);
      await userEvent.type(input, mockedInput);
    });

    expect(input).toHaveValue(mockedInput);
  },
};
