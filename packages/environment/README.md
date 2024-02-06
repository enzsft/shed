# Environment

Read environment variables.

## Installation

Install `@enzsft/environment`:

```sh
pnpm add -E @enzsft/environment
```

## Usage

To read an optional environment variable, this will return `undefined` if the variable is not set:

```ts
import { readEnvironmentVariable } from '@enzsft/environment";

const value = readEnvironmentVariable('MY_ENVIRONMENT_VARIABLE');
```

To read a required environment variable, this will throw an error if the variable is not set:

```ts
import { readEnvironmentVariable } from '@enzsft/environment";

const value = readEnvironmentVariable('MY_ENVIRONMENT_VARIABLE', { required: true });
```
