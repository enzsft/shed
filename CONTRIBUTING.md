# Contributing

## Respository

The repository is a monorepo containing multiple packages.

### Repository structure

| Directory              | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| [`.github`](.github)   | GitHub Actions workflows.                                              |
| [`.husky`](.husky)     | Husky precommit hook configuration.                                    |
| [`adrs`](adrs)         | Architectural decision records for this repository.                    |
| [`configs`](configs)   | Shared configuration files for various tools.                          |
| [`packages`](packages) | Reusable library packages for use in applications and other libraries. |
| [`scripts`](scripts)   | Scripts used across the repository like GitHub workflows.              |

## Required tooling

When working on projects you'll need the following tools installed:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.js.org/)

## Getting started

Before you can work on any packages nstall the repositories dependencies:

```sh
pnpm install
```

To run checks on the entire repository:

```sh
pnpm build
pnpm lint
pnpm test
pnpm typecheck
```

Work on a single package:

```sh
# Switch to the package you want to work on
cd packages/<package-name>

# Build that package
pnpm build

# Run the packages tests
pnpm test

# Run the packages tests in watch mode
pnpm test -- --watch
```

## Managing dependencies

We try to keep dev dependencies in the root `package.json`. This helps us align all out tooling for every package.

To add a new dev dependency:

```sh
pnpm add -D -w <package-name>
```

Any peer dependencies packages have should be added as dev dependencies to the root `package.json` of the package that depends on them. This ensures that they are available for every package in the repository that may need them.

## Publishing packages

We use [changesets](https://github.com/changesets/changesets) to orchestrate publishing, changelogs and versioning of packages. There is detailed documentation for how to use changesets in the [changesets repository](https://github.com/changesets/changesets) but here is a simple overview of the process.

When you want to publish packages you create a changeset:

```sh
pnpm changeset
```

Work through the CLI options and select which packages to release and what version bump they require (major, minor or patch) and answer any other questions.

Once you have created a changeset you can commit it to your branch and open a PR. When the PR is merged changeset will generate a changelog off your changeset and open its own PR. When that PR is merged changesets will publish unpublished packages to the registry.

## Architectural Decision Records

We use ADR's in this repository to document architectural decisions. You can find them in the [`adrs`](adrs) directory.

The tool we use to manage these is [adr-tools](https://github.com/npryce/adr-tools).
