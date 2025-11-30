# Warp Calendar

This is the monorepo for the Warp Calendar/Design Engineering exercise.

> **Note:** For design decisions and implementation details, see [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Project Structure

This project is organized as a Turborepo monorepo with the following structure:

### Apps

Apps are deployable applications:

- `web`: The main [Next.js](https://nextjs.org/) calendar application

### Packages

Packages contain shared logic and UI components:

- `@repo/ui`: React component library with calendar components, shared across apps
- `@repo/types`: Shared TypeScript type definitions
- `@repo/icons`: Shared icon components
- `@repo/eslint-config`: ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: Shared `tsconfig.json` configurations

## Getting Started

1. **Install Node.js:**

   This project requires Node.js 18 or higher. We recommend using a version manager like [nodenv](https://github.com/nodenv/nodenv) or [nvm](https://github.com/nvm-sh/nvm).

   ```bash
   # If using nodenv
   nodenv install

   # If using nvm
   nvm use
   ```

2. **Install pnpm:**

   This project uses [pnpm](https://pnpm.io/) as the package manager.

   ```bash
   corepack enable
   corepack prepare pnpm@9.0.0 --activate
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Run the development server:**

   ```bash
   pnpm dev
   ```

   This will start all apps in development mode. The web app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

From the root of the repository:

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start all apps in development mode |
| `pnpm build`       | Build all apps and packages        |
| `pnpm lint`        | Run ESLint across all packages     |
| `pnpm format`      | Format code with Prettier          |
| `pnpm check-types` | Run TypeScript type checking       |

### Running specific apps

You can run commands for specific apps using Turborepo filters:

```bash
# Run only the web app
pnpm dev --filter=web

# Build only the UI package
pnpm build --filter=@repo/ui
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Turborepo](https://turbo.build/) - Monorepo build system
- [pnpm](https://pnpm.io/) - Package manager
- [date-fns](https://date-fns.org/) - Date utilities
