# Ionic 8 Starter

A template to kickstart Ionic + React applications utilizing an opinionated technology stack for optimal testability, maintainability, and operability.

[![CI](https://github.com/leanstacks/ionic8-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/leanstacks/ionic8-starter/actions/workflows/ci.yml)
&nbsp;
&nbsp;
[![Code Quality](https://github.com/leanstacks/ionic8-starter/actions/workflows/code-quality.yml/badge.svg)](https://github.com/leanstacks/ionic8-starter/actions/workflows/code-quality.yml)

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## Documentation

For detailed guides and reference materials, see the [Project Documentation](docs/README.md).

## Helpful Hints

### Data

This project's API integration uses the simulated REST endpoints made available by [JSON Placeholder](https://jsonplaceholder.typicode.com/).

### Authentication

When running the application, you may sign in with any of the JSON Placeholder [Users](https://jsonplaceholder.typicode.com/users). Simply enter the _Username_ value from any user in the API and use any value for the _Password_. For example, try username `Bret` and password `abc123`.

### Easter Eggs

#### Diagnostics

Many applications, particularly mobile applications, have a hidden page which displays content useful for troubleshooting and support. To access the diagnostics page, go to the _Account_ page. Locate the _About_ section and click or tap the _Version_ item 7 times.

## About

This project was bootstrapped with the [Ionic CLI](https://ionicframework.com/docs/cli/commands/start).

```
ionic start ionic8-starter blank --type=react
```

The application production technology stack includes:

- Ionic - the foundation
- Vite - React development environment
- React - SPA framework
- React Router Dom - routing
- TanStack Query - data fetching, caching, and asynchronous state management
- Axios - HTTP client
- React Hook Form - form management
- Zod - schema-based validation
- Lodash - utility functions
- date-fns - date utility functions
- i18next - internationalization framework

The application development technology stack includes:

- Vitest - unit tests
- Testing Library React - unit tests
- MSW - API mocking
- Cypress - end-to-end tests
- TypeScript

The infrastructure technology stack includes:

- AWS CDK - framework for provisioning AWS cloud infrastructure
- Zod - schema based validation
- Jest: unit test framework

### Repository

This repository uses [trunk-based development](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development). The latest code is located on the `main` branch. The `main` branch is always ready for deployment.

Features are developed on branches named `feature/NNNNN` which are created from the `main` branch. The feature name used in the branch contains an issue identifier or a short name, e.g. `feature/123-do-something`.

Releases are created on branches named `release/MM.mm.pp` which are created from the `main` branch. The release name follows the [semantic versioning](https://semver.org/) specification.

Hotfixes are created on branches named `release/MM.mm.pp` which are created from the appropriate `release/MM.mm.pp` branch.

A pull request must be opened requesting merge from any branch back to `main`. GitHub actions perform continuous integration, CI, checks against the PR source branch. At least one code review approval is required to complete the pull request.

See also: [Feature flags](https://www.atlassian.com/continuous-delivery/principles/feature-flags)

### Issue Management

This project uses [GitHub Issues](https://github.com/leanstacks/ionic8-starter/issues).

### Code Formatting

The project includes configuration files for the [Prettier](https://prettier.io/docs/en/configuration.html) and [EditorConfig](https://editorconfig.org/) code formatters. This allows all project contributors to share the same code formatting rules.

Adjust the configuration as desired.

## Installation

### Prerequistes

It is strongly recommended that you install Node Version Manager, [`nvm`][nvm]. Node Version Manager simplifies working on multiple projects with different versions of Node.js.

### Clone the Repository

Open the [repository][repo] in a browser. Follow the instructions to clone the repository to your local machine.

### Install Node

Open a terminal window and navigate to the project base directory. Issue the following command to install the version of Node and NPM used by the application:

```bash
# If you already have this version of Node, simply switch to it...
nvm use

# If you do NOT have this version of Node, install it...
nvm install
```

Node Version Manager inspects the `.nvmrc` file in the project base directory and uses or installs the specified version of Node and the Node Package Manager, npm.

### Install the Dependencies

To install the project dependencies, issue the following commands at a terminal prompt in the project base directory:

```bash
# Switch to the project node version...
nvm use

# Install project dependencies
npm install
```

### After Installation

The installation is now complete! You may open the project in your favorite source code editor (we recommend [Visual Studio Code](https://code.visualstudio.com/)).

We recommend the following VS Code extensions:

- Prettier - Code formatter (required)
- ESLint - Source code analysis (recommended)
- GitHub Copilot (recommended)
- Ionic (optional)
- Indent Rainbow (optional)
- GitLens (optional)
- Dotenv Official +Vault (optional)
- GitHub Actions (optional)

Install the _Prettier_ extension to ensure that all project participants' contributions are formatted using the same rules. The extension leverages project-specific rules found in the `.prettierrc` file in the project base directory.

## Configuration

See the [Configuration Guide](./docs/CONFIGURATION_GUIDE.md) in the [project docs](./docs/README.md) for detailed information about application and infrastructure configuration.

# Available Scripts

Many of the scripts leverage the [Ionic CLI](https://ionicframework.com/docs/cli), the [Vite CLI](https://vitejs.dev/guide/cli.html), or the [Vitest CLI](https://vitest.dev/guide/cli.html). Read more about them in their respective official guides.

In the project base directory, the following commands are available to run.

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://vitest.dev/guide/cli.html) for more information.

### `npm run test:coverage`

Runs the test suites once and produces a coverage report. A detailed test coverage report is created in the `./coverage` directory.

### `npm run test:ci`

Executes the test runner in `CI` mode and produces a coverage report. With `CI` mode enabled, the test runner executes all tests one time and prints a summary report to the console. A code coverage report is printed to the console immediately following the test summary.

A detailed test coverage report is created in the `./coverage` directory.

> **NOTE:** This is the command which should be utilized by CI/CD platforms.

### `npm run test:e2e`

Runs all end-to-end (e2e) tests using the Cypress framework. See the [Cypress CLI](https://docs.cypress.io/guides/guides/command-line) documentation for more information.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles in production mode and optimizes the build for the best performance.

See the official guide for more information about [building for production](https://vitejs.dev/guide/build.html) and [deploying a static site](https://vitejs.dev/guide/static-deploy.html).

### `npm run lint`

Runs the [ESLint][eslint] static code analysis and prints the results to the console.

## DevOps

### Automation

See the [DevOps Guide](./docs/DEVOPS_GUIDE.md) in the [project docs](./docs/README.md) for detailed information about DevOps automation workflows.

### Infrastructure

See the [Infrastructure Guide](./docs/INFRASTRUCTURE_GUIDE.md) in the [project docs](./docs/README.md) for detailed information about the AWS infrastructure and the AWS CDK application to provision those resources.

## Further Reading

- [Project Documentation](./docs/README.md)
- [Ionic][ionic]
- [Vite][vite]
- [React][react]
- [TanStack][tanstack]
- [Axios][axios]
- [React Hook Form][rhf]
- [Zod][zod]
- [Testing Library][testing-library]
- [Vitest][vitest]
- [Cypress][cypress]
- [ESLint][eslint]
- [GitHub Actions][ghactions]

[repo]: https://github.com/leanstacks/ionic8-starter 'GitHub Repository'
[nvm]: https://github.com/nvm-sh/nvm 'Node Version Manager'
[ionic]: https://ionicframework.com/docs/react 'Ionic with React'
[vite]: https://vitejs.dev/ 'Vite'
[react]: https://react.dev/ 'React'
[axios]: https://axios-http.com/ 'Axios'
[rhf]: https://react-hook-form.com/ 'React Hook Form'
[tanstack]: https://tanstack.com/ 'TanStack'
[testing-library]: https://testing-library.com/ 'Testing Library'
[vitest]: https://vitest.dev/ 'Vitest Testing Framework'
[ghactions]: https://docs.github.com/en/actions 'GitHub Actions'
[eslint]: https://eslint.org/docs/latest/ 'ESLint'
[cypress]: https://docs.cypress.io/guides/overview/why-cypress 'Cypress Testing Framework'
[zod]: https://zod.dev/ 'Zod'
