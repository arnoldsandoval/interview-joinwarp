import "@/styles/globals.css";
import { DocsRenderer } from "@storybook/addon-docs";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";

import type {
  DocsContextProps,
  Parameters,
  Renderer,
} from "storybook/internal/types";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <div className="antialiased">
        <Story />
      </div>
    ),
  ],
  parameters: {
    darkMode: {
      classTarget: "html",
      darkClass: "dark",
      lightClass: "light",
    },

    /**
     * Customize the docs theme based on the global theme (light/dark)
     * selected in the toolbar.
     *
     * s/o yanickrochon on GitHub for this solution.
     *
     * @see https://github.com/storybookjs/storybook/issues/26242#issuecomment-3105503486
     */
    docs: {
      theme: themes.normal,
      renderer: () => {
        const renderer = new DocsRenderer();
        const oldRender = renderer.render;

        renderer.render = async (
          context: DocsContextProps<Renderer>,
          docsParameter: Parameters,
          element: HTMLElement
        ) => {
          const theme = (context as any).store.userGlobals.globals.theme;

          docsParameter.theme = theme === "dark" ? themes.dark : themes.normal;

          const result = await oldRender.call(
            renderer,
            context,
            docsParameter,
            element
          );

          return result;
        };

        return renderer;
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
