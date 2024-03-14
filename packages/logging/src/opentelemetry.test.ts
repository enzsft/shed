import { trace } from "@opentelemetry/api";
import { getOpenTelemetryTracingContext } from "./opentelemetry";

jest.mock("@opentelemetry/api", () => {
  const setAttributes = jest.fn();

  return {
    trace: {
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

it("should return tracing context", () => {
  const tracingContext = getOpenTelemetryTracingContext();

  expect(tracingContext).toEqual({
    getTraceId: expect.any(Function),
    getSpanId: expect.any(Function),
    addSpanData: expect.any(Function),
  });
  expect(tracingContext.getTraceId()).toBe("mock-trace-id");
  expect(tracingContext.getSpanId()).toBe("mock-span-id");
});

it("should set flattened attributes on active span", () => {
  const tracingContext = getOpenTelemetryTracingContext();

  tracingContext.addSpanData({
    foo: "bar",
    baz: {
      qux: "quux",
    },
  });

  expect(trace.getActiveSpan()?.setAttributes).toHaveBeenCalledWith({
    foo: "bar",
    "baz.qux": "quux",
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
