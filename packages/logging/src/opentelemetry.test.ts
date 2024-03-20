import { trace } from "@opentelemetry/api";
import { getOpenTelemetryTracingContext } from "./opentelemetry";

jest.mock("@opentelemetry/api", () => {
  const setAttributes = jest.fn();

  return {
    trace: {
      getTracer: jest.fn(() => ({
        startActiveSpan: jest.fn((name, fn) =>
          fn({
            spanContext: jest.fn(() => ({
              spanId: "mock-span-id",
            })),
            end: jest.fn(),
          }),
        ),
      })),
      getActiveSpan: jest.fn(() => ({
        spanContext: jest.fn(() => ({
          traceId: "mock-trace-id",
          spanId: "mock-span-id",
        })),
        setAttributes,
      })),
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

it("should return tracing context (no custom name)", async () => {
  const tracingContext = getOpenTelemetryTracingContext();

  expect(tracingContext).toEqual({
    getTraceId: expect.any(Function),
    getSpanId: expect.any(Function),
    getSpanName: expect.any(Function),
    addSpanData: expect.any(Function),
    withSpan: expect.any(Function),
  });
  expect(tracingContext.getTraceId()).toBe("mock-trace-id");
  expect(tracingContext.getSpanId()).toBe("mock-span-id");
  expect(await tracingContext.withSpan("test", () => Promise.resolve("result"))).toBe("result");
});

it("should assign the tracer the default name", () => {
  getOpenTelemetryTracingContext();

  expect(trace.getTracer).toHaveBeenCalledWith("@enzsft/logger");
});

it("should return tracing context (with custom name)", async () => {
  getOpenTelemetryTracingContext("custom");

  expect(trace.getTracer).toHaveBeenCalledWith("custom");
});

describe("getTraceId", () => {
  it("should return trace ID", () => {
    expect(getOpenTelemetryTracingContext().getTraceId()).toBe("mock-trace-id");
  });

  it("should return undefined if there is no active span", () => {
    (trace.getActiveSpan as jest.Mock).mockReturnValueOnce(undefined);

    expect(getOpenTelemetryTracingContext().getTraceId()).toBeUndefined();
  });
});

describe("getSpanId", () => {
  it("should return span ID", () => {
    expect(getOpenTelemetryTracingContext().getSpanId()).toBe("mock-span-id");
  });

  it("should return undefined if there is no active span", () => {
    (trace.getActiveSpan as jest.Mock).mockReturnValueOnce(undefined);

    expect(getOpenTelemetryTracingContext().getSpanId()).toBeUndefined();
  });
});

describe("getSpanName", () => {
  it("should return undefined if there is no active span created by this tracing context", () => {
    (trace.getActiveSpan as jest.Mock).mockReturnValueOnce(undefined);

    expect(getOpenTelemetryTracingContext().getSpanName()).toBeUndefined();
  });

  it("should return span name when in active span created by this tracing context", async () => {
    let spanName: string | undefined = "";

    const tractingcContext = getOpenTelemetryTracingContext();
    await tractingcContext.withSpan("mock-span-name", async () => {
      spanName = tractingcContext.getSpanName();
    });

    expect(spanName).toBe("mock-span-name");
  });
});

describe("addSpanData", () => {
  it("should set flattened attributes on active span", () => {
    const tracingContext = getOpenTelemetryTracingContext();

    tracingContext.addSpanData({
      foo: "bar",
      baz: {
        qux: "quux",
      },
      num: 0,
      bool: false,
    });

    expect(trace.getActiveSpan()?.setAttributes).toHaveBeenCalledWith({
      foo: "bar",
      "baz.qux": "quux",
      num: "0",
      bool: "false",
    });
  });

  it("should not set attributes if there is no active span", () => {
    (trace.getActiveSpan as jest.Mock).mockReturnValueOnce(undefined);

    const tracingContext = getOpenTelemetryTracingContext();

    tracingContext.addSpanData({});

    expect(trace.getActiveSpan()?.setAttributes).not.toHaveBeenCalled();
  });

  it("should handle setting no attributes", () => {
    const tracingContext = getOpenTelemetryTracingContext();

    tracingContext.addSpanData({});

    expect(trace.getActiveSpan()?.setAttributes).toHaveBeenCalledWith({});
  });
});
