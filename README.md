<div align="center" style="padding-bottom: 1rem">
  <img src="./logo.svg" alt="Enzyme Software Logo" />
</div>

# Shed

A shed is where you store you tools right!

## Packages

| Package                               | Description                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| [`styles`](packages/styles)           | Utilities to work with styles.                                                |
| [`environment`](packages/environment) | Utilities for interacting with environment variables.                         |
| [`logging`](packages/logging)         | Isomorphic logging library, suitable for use in both Node.js and the browser. |
| [`props`](packages/props)             | Utilities for constructing props.                                             |

## Installing packages

These packages are published to the GitHub Package Registry. Before installing them you need to add the following to your `.npmrc` or `.yarnrc` file:

```sh
@enzsft:registry=https://npm.pkg.github.com
```

Then you can install the packages using your favourite package manager like `pnpm`, `npm` or `yarn`:

```sh
pnpm add @enzsft/styles
npm install @enzsft/styles
yarn add @enzsft/styles
```

## Contributing

Please refer to our [contributing documentation](./CONTRIBUTING.md) for details on how to contribute to this repository.
