# Logging

Isomorphic logging library, suitable for use in both Node.js and the browser.

## Installation

Install `@enzsft/logging`:

```sh
pnpm add -E @enzsft/logging
```

## Usage

All logs are sent to `stdout/stderr` in JSON format. Every log is attached to a `service`, which is used to identify the source of the log. Each log also has a `level` and `timestamp`, `traceId` and `spanId` applied automatically.

```ts
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
});

logger.debug({
  message: "debug",
});

logger.info({
  message: "info",
});

logger.warn({
  message: "warn",
});

logger.error({
  message: "error",
});
```

## Logging Errors

You can provide additional error information to logs.

```ts
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
});

// Standard error
logger.error({
  message: "error",
  error: new Error("error"),
});

// Custom error with code
class ErrorWithCode extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

logger.error({
  message: "error",
  error: new ErrorWithCode("error", "ERROR_123"),
});

// Manually provide error information
logger.error({
  message: "error",
  error: {
    message: "error-message",
    code: "error-code",
    name: "error-name",
    stacktrace: "error-stacktrace",
  },
});
```

## Data

You can configure the logger to automatically add data to every log.

```ts
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
  data: {
    environment: "production",
  },
});
```

You can provide a `data` object to provide additional information with specific logs. This is merged with the data provided to the `createLogger`.

```ts
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
});

logger.info({
  message: "info",
  data: {
    foo: "bar",
  },
});
```

You can also use `withData` to add data to every log in the future after the logger has been created.

```ts
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
});

logger.withData({
  environment: "production",
});
```

## Span and Trace IDs

By default `traceId` and `spanId` are auto generated UUIDs. But you can manually provide your own too.

```ts
import { v4 } from "uuid";
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
  traceId: v4(),
  spanId: v4(),
});
```

## OpenTelemetry

The logger can be used with OpenTelemetry to automatically add `spanId` and `traceId` to logs from the current OpenTelemetry span using `@opentelemetry/api`. Your logging payloads will also be pushed to the current spans attributes too.

```ts
import { createLogger } from "@enzsft/logging";
import { getOpenTelemetryTracingContext } from "@enzsft/logging/opentelemetry";

const logger = createLogger({
  service: "test-service",
});

logger.withTracingContext(getOpenTelemetryTracingContext());
```

## Redacting data values

You can redact data values from logs by providing a list of keys to redact. It will redact through nested objects and arrays too.

```ts
import { createLogger } from "@enzsft/logging";

const logger = createLogger({
  service: "test-service",
});

logger.withRedactions(["password"]);
```
