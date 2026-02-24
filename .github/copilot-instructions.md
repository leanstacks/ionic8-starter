# Copilot Instructions for an Ionic React Component

This guide provides instructions for using **GitHub Copilot** and onboarding developers working on this Ionic React front end project written in **TypeScript** with the **Vite** framework and **Vitest co-located unit tests**, and using the **AWS CDK** for infrastructure as code.

---

## Role

You are a **Senior TypeScript developer** working on an Ionic React front end project. Your goal is to create efficient, maintainable, and testable components using best practices for TypeScript development, Vite for build tooling, and Vitest for unit testing. You will use the guidelines and best practices outlined in this document to ensure consistency and quality across the codebase.

---

## Project Overview

- **Component:** Ionic Starter (ionic8-starter)
- **Description:** This component provides a user interface for creating, listing, and maintaining users. As this is a starter project, it contains essential features such as routing, state management, form handling, and API integration.

---

## Technology Stack

The Ionic React application leverages a modern technology stack to ensure optimal performance, maintainability, and developer experience.

- **Language:**: TypeScript
- **UI Library**: Ionic with React
- **UI Router** React Router DOM
- **Build Tool**: Vite
- **Form Management**: React Hook Form
- **Validation**: Zod
- **API Client**: Tanstack Query
- **HTTP Client**: Axios
- **Styling**: CSS Modules
- **Component Library**: Ionic UI components
- **Font Awesome**: icons
- **Utility Library**: Lodash
- **Date Library**: date-fns
- **Unit Testing**: Vitest
- **Code Coverage**: Vitest V8
- **React Testing Library**: @testing-library/react
- **IaC Deployment**: AWS CDK
- **CI/CD**: GitHub Actions

---

## Project Structure

This project follows a structure that separates application-wide **common** components, hooks, and utils from page-level components, hooks, and utils with tests in `__tests__` directories. This promotes modularity and maintainability.

```
src
  /common                               # Application-wide shared components, hooks, and utils
    /api                                # API hooks for common data fetching and mutations
      useGetCurrentUser.ts              # API hook for fetching current user
      useGetSettings.ts
      useGetUserTokens.ts
      useUpdateSettings.ts
      __tests__/                        # Unit tests for API hooks
    /components                         # Common reusable UI components
      types.ts                          # Common component type definitions
      /Header
        Header.tsx                      # Application header component
        Header.scss                     # Header styles
        __tests__/                      # Unit tests for Header
      /Router
        AppRouter.tsx                   # Application router component
        PrivateOutlet.tsx               # Protected route component
        TabNavigation.tsx               # Tab navigation component
        TabNavigation.scss
        __tests__/
    /models                             # Common data models and type definitions
      auth.ts                           # Auth type definitions
      profile.ts
      settings.ts
      user.ts
    /providers                          # Common context providers for state management
      AuthContext.ts                    # Auth context definition
      AuthProvider.tsx                  # Auth provider component
      AuthProvider.scss                 # Auth provider styles
      __tests__/
    /hooks                              # Common custom hooks for shared logic
      useAuth.ts                        # Custom hook for authentication
      useConfig.ts
      __tests__/
    /utils                              # Common utility functions and helpers
      constants.ts                      # Shared constants
      query-client.ts                   # React Query client configuration
      storage.ts                        # Local storage utilities
      i18n/                             # Internationalization utilities
      __tests__/                        # Unit tests for utils
  /pages                                # Page-specific components, hooks, and utils
    /Account                            # Account page and related components
    /Auth                               # Authentication pages (login, signup, etc.)
    /Home                               # Home page
    /Users                              # Users page family and related components
      /api
        useCreateUser.ts                # Hook for creating users
        __tests__/
      /components                       # User-related components
        /UserAdd                        # Component for adding a user
        /UserDelete
        /UserDetail
      /utils
        users.ts                        # Utility functions for user logic
        __tests__/                      # Unit tests for user utils
  /test                                 # Test configuration and utilities
    query-client.ts                     # Test query client configuration
    test-utils.tsx                      # Test utility functions and custom render
    /mocks                              # Mock data and handlers
    /wrappers                           # Test wrapper components
  /theme                                # Application theme and styles
    fonts.css                           # Font definitions
    grid.css                            # Grid layout styles
    main.css                            # Main stylesheet
    normalize.css                       # CSS normalization
    typography.css                      # Typography styles
    variables.css                       # CSS custom properties
  /__fixtures__                         # Test fixtures and mock data
    appinfo.ts                          # App info fixtures
    profiles.ts                         # Profile fixtures
    settings.ts                         # Settings fixtures
    toasts.ts                           # Toast fixtures
    users.ts                            # User fixtures
  App.tsx                               # Main application component
  App.test.tsx                          # Unit test for App
  main.tsx                              # Application entry point
  setupTests.ts                         # Test environment setup
  vite-env.d.ts                         # Vite environment type definitions

/infrastructure                         # AWS CDK infrastructure code (future)
  /stacks
    cdn-stack.ts                        # AWS CDK stack for CDN resources
  app.ts                                # AWS CDK app entry point
  cdk.json                              # AWS CDK configuration
  tsconfig.json                         # TypeScript configuration for AWS CDK
  package.json                          # Dependencies and scripts for AWS CDK infrastructure

tsconfig.json                           # Main project TypeScript config
tsconfig.node.json                      # TypeScript config for Node scripts
vite.config.ts                          # Vite config
eslint.config.mjs                       # ESLint config
capacitor.config.ts                     # Capacitor config for mobile apps
ionic.config.json                       # Ionic config
cypress.config.ts                       # Cypress E2E testing config
.nvmrc                                  # Node version specification
package.json                            # Project dependencies and scripts
.env                                    # Environment variables
```

---

## Development Guidelines

### TypeScript Development

- Use **TypeScript** for all source code.
- Use **strict mode** in `tsconfig.json` for type safety.
- Use **interfaces** for defining types, especially for props and state.
- Use **type aliases** for utility types and complex types.
- Use **enums** for fixed sets of values.
- Use **destructuring** for props and state in components.
- Use **async/await** for asynchronous operations.
- Use **optional chaining** and **nullish coalescing** for safer property access.
- Use **type guards** for narrowing types.
- Use **generics** for reusable components and functions.
- Use **type assertions** sparingly and only when necessary.
- Use **type inference** where possible to reduce redundancy.
- Use **type-safe imports** to ensure correct types are used.
- Use **ESLint** with TypeScript rules for linting.
- Use **Prettier** for code formatting.
- Do not use barrel files (index.ts).

### React Component Development

- Use **functional components** with hooks.
- Use **TypeScript** for type safety.
- Return **JSX.Element** or **false** from components.
- Use arrow functions for components.
- Use the `data-testid` attribute to assist with testing.
- Use default exports for components.
- Use a **testId** prop for components that need to be tested, defaulting to the component name in kebab-case.

### Styling Guidelines

- Use CSS modules for styling.
- Use BEM naming convention for CSS classes.
- Application theme and global styles live in the `theme` directory.

### Configuration

- Use **.env** for environment variables prefixed with `VITE_` for Vite compatibility.
- Example application configuration values in the `.env.example` file, but do not commit actual `.env` files.
- Use Zod for schema validation of configuration values.

### Maintainability

- Keep components small and focused on a single responsibility.
- Use comments to explain complex logic, but avoid obvious comments.
- Organize imports logically: external libraries first, then internal components, hooks, and utils.

---

## Testing Guidelines

- Use **Vitest**.
- Place test files in the `__tests__` directory adjacent to the source file, with `.test.ts` suffix.
- Use Arrange - Act - Assert (AAA) pattern for test structure:
  - **Arrange:** Set up the test environment and inputs.
  - **Act:** Call the function being tested.
  - **Assert:** Verify the output and side effects.
- Use `test-utils` for common test functions and helpers.
- Use `describe` and `it` blocks for organization.
- Mock dependencies using `vi.mock` or similar.
- Use `beforeEach` for setup and `afterEach` for cleanup as needed.
- Use `expect` assertions for results.
- Use the `data-testid` attribute for selecting elements in tests.
- Use `screen` from `@testing-library/react` for querying elements.
- Use `userEvent` from `@testing-library/user-event` for simulating user interactions.
- Prefer unit tests over integration tests in this repo.
- 80% code coverage is the minimum requirement for all components and features.

---

## AWS CDK Guidelines

- Self-contained infrastructure code in the `infrastructure` directory.
- Define one CDK stack per major grouping of resources (e.g., CDN).
- Use **.env** for environment variables prefixed with `CDK_`.
- Example infrastructure configuration values in the `infrastructure/.env.example` file, but do not commit actual `.env` files.
- Use Zod for schema validation of configuration values.
- Tag all CDK resources appropriately (`App`, `Env`, `OU`, `Owner`).
- Deploy separate environments (dev/qa/prd) using configuration values.
