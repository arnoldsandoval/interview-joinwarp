import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/form";
import { Input } from "@/components/input";
import { Toaster } from "@/components/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { expect, fn, userEvent, within } from "storybook/test";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Building forms with React Hook Form and Zod.
 */
const meta = {
  title: "ui/Form",
  component: Form,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
  render: () => <ProfileForm onSubmit={fn()} />,
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const ProfileForm = ({
  onSubmit: onSubmitAction,
}: {
  onSubmit?: (values: FormValues) => void;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: FormValues) {
    onSubmitAction?.(values);
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-foreground p-4">
          <code className="text-background">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-96">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl
                  render={<Input placeholder="username" {...field} />}
                />
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="ml-auto block">
            Submit
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
};

/**
 * The default form of the form.
 */
export const Default: Story = {};

export const ShouldSucceedWhenValidInput: Story = {
  name: "when typing a valid username, should not show an error message",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    await step("Type a valid username", async () => {
      await userEvent.type(
        await canvas.findByRole("textbox", { name: /username/i }),
        "mockuser"
      );
    });

    await step("Click the submit button", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /submit/i })
      );
      expect(
        await canvas.queryByText(/username must be at least 6 characters/i, {
          exact: true,
        })
      ).toBeNull();
    });
  },
};

export const ShouldShowErrorWhenInvalidInput: Story = {
  name: "when typing a short username, should show an error message",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    await step("Type a short username", async () => {
      await userEvent.type(
        await canvas.findByRole("textbox", { name: /username/i }),
        "fail"
      );
    });

    await step("Click the submit button", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /submit/i })
      );
      expect(
        await canvas.queryByText(/username must be at least 6 characters/i, {
          exact: true,
        })
      ).toBeVisible();
    });
  },
};

/**
 * Component that deliberately calls useFormField outside of FormField context
 * to trigger the error case for test coverage
 */
const InvalidFormFieldUsage = () => {
  try {
    useFormField(); // This will throw an error
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
  name: "Form components should throw error when used outside context",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: { disable: true }, // Disable a11y testing for error demonstration
    chromatic: { disableSnapshot: true }, // Don't snapshot error states
  },
  render: () => (
    <div
      data-testid="context-test"
      className="p-4 border border-red-200 bg-red-50 rounded"
    >
      <h3 className="font-semibold text-red-800 mb-2">Context Error Test</h3>
      <p className="text-red-700 text-sm mb-2">
        If FormField, FormControl, or other form components are used outside of
        their proper context, they will throw an error. This component
        demonstrates that behavior:
      </p>
      <InvalidFormFieldUsage />
      <p className="text-red-700 text-xs mt-2">
        The error above validates that form components properly throw when
        context is null.
      </p>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify context error is thrown and caught", async () => {
      const contextTest = canvas.getByTestId("context-test");
      expect(contextTest).toBeInTheDocument();

      // Verify the error was caught and displayed
      const errorMessage = await canvas.findByTestId("error-caught");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toMatch(
        /Error.*useFormField should be used within.*FormField|cannot destructure.*useFormContext/i
      );
    });
  },
};
