import { TracingContext, createLogger } from "./index";

const mockConsoleDebug = jest.spyOn(console, "debug").mockImplementation(() => {});
const mockConsoleInfo = jest.spyOn(console, "info").mockImplementation(() => {});
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("log level", () => {
  it("should log debug", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.debug({
      message: "debug 1",
    });

    expect(mockConsoleDebug).toHaveBeenCalledTimes(1);
  });

  it("should log info", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.info({
      message: "info 1",
    });

    expect(mockConsoleInfo).toHaveBeenCalledTimes(1);
  });

  it("should log warn", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.warn({
      message: "warn 1",
    });

    expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
  });

  it("should log error", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.error({
      message: "error 1",
    });

    expect(mockConsoleError).toHaveBeenCalledTimes(1);
  });
});

describe("default payload", () => {
  it("should log the default payload", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.info({
      message: "info 1",
    });

    const payload = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
    });
  });

  it("should log the error payload", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.error({
      message: "error 1",
      error: {
        message: "error-message",
        code: "error-code",
        name: "error-name",
        stacktrace: "error-stacktrace",
      },
    });

    const payload = mockConsoleError.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "error 1",
      error: {
        message: "error-message",
        code: "error-code",
        name: "error-name",
        stacktrace: "error-stacktrace",
      },
      level: "error",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
    });
  });

  it("should log error payload from literal error", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.error({
      message: "error 1",
      error: new Error("error-message"),
    });

    const payload = mockConsoleError.mock.calls[0][0];
    console.debug(payload);

    expect(JSON.parse(payload)).toEqual({
      message: "error 1",
      error: {
        message: "error-message",
        name: "Error",
        stacktrace: expect.any(String),
      },
      level: "error",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
    });
  });

  it("should log error payload from literal error with code", () => {
    const logger = createLogger({
      service: "test-service",
    });

    class ErrorWithCode extends Error {
      code: string;

      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    }

    logger.error({
      message: "error 1",
      error: new ErrorWithCode("error-message", "error-code"),
    });

    const payload = mockConsoleError.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "error 1",
      error: {
        message: "error-message",
        name: "Error",
        stacktrace: expect.any(String),
        code: "error-code",
      },
      level: "error",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
    });
  });
});

describe("data", () => {
  it("should log with default data", () => {
    const logger = createLogger({
      service: "test-service",
      data: {
        foo: "bar",
      },
    });

    logger.info({
      message: "info 1",
    });

    const payload = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
      data: {
        foo: "bar",
      },
    });
  });

  it("should merge data from log call", () => {
    const logger = createLogger({
      service: "test-service",
      data: {
        foo: "bar",
      },
    });

    logger.info({
      message: "info 1",
      data: {
        bar: "baz",
      },
    });

    const payload = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
      data: {
        foo: "bar",
        bar: "baz",
      },
    });
  });
});

describe("span and trace ids", () => {
  it("should override span and trace id", () => {
    const logger = createLogger({
      service: "test-service",
      traceId: "trace-id",
      spanId: "span-id",
    });

    logger.info({
      message: "info 1",
    });

    const payload = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: "trace-id",
      spanId: "span-id",
    });
  });
});

describe("withSpan", () => {
  it("should warn about nested spans not being supported in default tracing context", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.withSpan("test-span", async () => {});

    expect(mockConsoleWarn).toHaveBeenCalledWith(
      "Nested spans are not supported in the default tracing context. Please provide a TracingContext implementation.",
    );
  });
});

describe("withData", () => {
  it("should embelish future logs with data", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.info({
      message: "info 1",
    });

    logger.withData({
      foo: "bar",
    });

    logger.info({
      message: "info 2",
    });

    const payloadOne = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payloadOne)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
    });

    const payloadTwo = mockConsoleInfo.mock.calls[1][0];

    expect(JSON.parse(payloadTwo)).toEqual({
      message: "info 2",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
      data: {
        foo: "bar",
      },
    });
  });

  it("should merge embelished data", () => {
    const logger = createLogger({
      service: "test-service",
      data: {
        baz: "qux",
      },
    });

    logger.info({
      message: "info 1",
    });

    logger.withData({
      foo: "bar",
    });

    logger.info({
      message: "info 2",
    });

    const payloadOne = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payloadOne)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
      data: {
        baz: "qux",
      },
    });

    const payloadTwo = mockConsoleInfo.mock.calls[1][0];

    expect(JSON.parse(payloadTwo)).toEqual({
      message: "info 2",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
      data: {
        foo: "bar",
        baz: "qux",
      },
    });
  });
});

describe("withTracingContext", () => {
  const mockTracingContext: TracingContext = {
    getSpanId: () => "mock-span-id",
    getTraceId: () => "mock-trace-id",
    withSpan: async (name, fn) => {
      return fn();
    },
    addSpanData: jest.fn(),
  };

  it("should embelish future logs with open telemetry span and trace ids", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.withTracingContext(mockTracingContext);

    logger.info({
      message: "info 1",
    });

    const payload = mockConsoleInfo.mock.calls[0][0];

    expect(JSON.parse(payload)).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: "mock-trace-id",
      spanId: "mock-span-id",
    });
  });

  it("should add span data", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.withTracingContext(mockTracingContext);

    logger.info({
      message: "info 1",
      data: {
        foo: "bar",
      },
    });

    expect(mockTracingContext.addSpanData).toHaveBeenCalledWith({
      foo: "bar",
    });
  });
});

describe("withRedactions", () => {
  it("should redact data", () => {
    const logger = createLogger({
      service: "test-service",
    });

    logger.withRedactions({
      keysToRedact: ["password"],
    });

    logger.info({
      message: "info 1",
      data: {
        username: "test-user",
        password: "test-password",
      },
    });

    const payload = mockConsoleInfo.mock.calls[0][0];
    const parsedPayload = JSON.parse(payload);

    expect(parsedPayload).toEqual({
      message: "info 1",
      level: "info",
      timestamp: expect.any(Number),
      service: "test-service",
      traceId: expect.any(String),
      spanId: expect.any(String),
      data: {
        username: "test-user",
        password: "<redacted>",
      },
    });
  });
});
