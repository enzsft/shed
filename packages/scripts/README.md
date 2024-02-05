# Scripts

Utility scripts for this repositories packages.

## Usage

The binary `scripts` is available when installed. It provides several commands to use in packages.

### Commands

#### `build-library`

Build a library package, providing ESM, CJS and type outputs. Combines `build-esm`, `build-cjs` and `build-types`.

```sh
scripts build-library
```

#### `test`

Runs tests using [Jest](https://jestjs.io/). All arguments are forwarded to Jest.

```sh
# Run all tests in package
scripts test

# Test and watch for changes
scripts test --watch

# Coverage
scripts test --coverage
```

#### `typecheck`

Runs type checking using [tsc](https://www.typescriptlang.org/). All arguments are forwarded to tsc.

```sh
# Run type checking
scripts typecheck
```
