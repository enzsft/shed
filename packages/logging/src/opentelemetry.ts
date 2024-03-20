import { trace, Attributes } from "@opentelemetry/api";
import type { LogData, TracingContext } from ".";

const extractAttributes = (obj: LogData, prefix = ""): Attributes => {
  const attributes: Attributes = {};

  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return attributes;
  }

  for (const key of keys) {
    const value = obj[key];
    const attributeKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(attributes, extractAttributes(value, attributeKey));
      continue;
    }

    if (value || value === 0 || value === false) {
      attributes[attributeKey] = value.toString();
    }
  }

  return attributes;
};

/**
 * Get the current OpenTelemetry tracing context
 *
 * @param name The name of the tracer
 * @returns The OpenTelemetry tracing context
 */
export const getOpenTelemetryTracingContext = (name?: string): TracingContext => {
  const tracer = trace.getTracer(name ?? "@enzsft/logger");
  const spanIdNameMap = new Map<string, string>();

  const getSpanContext = () => {
    return trace.getActiveSpan()?.spanContext();
  };

  const getSpanId = (): string | undefined => {
    return getSpanContext()?.spanId;
  };

  const getTraceId = (): string | undefined => {
    return getSpanContext()?.traceId;
  };

  const removeSpanIdName = (spanId: string) => {
    spanIdNameMap.delete(spanId);
  };

  const setSpanIdName = (spanId: string, name: string) => {
    spanIdNameMap.set(spanId, name);
  };

  const addSpanData = (data: LogData) => {
    const currentSpan = trace.getActiveSpan();

    if (!currentSpan) {
      return;
    }

    const attributes = extractAttributes(data);
    currentSpan.setAttributes(attributes);
  };

  const withSpan: TracingContext["withSpan"] = async (name, fn) => {
    return tracer.startActiveSpan(name, async (span) => {
      const spanId = span.spanContext().spanId;
      setSpanIdName(spanId, name);

      try {
        return await fn();
      } finally {
        span.end();
        removeSpanIdName(spanId);
      }
    });
  };

  const getSpanName = () => {
    const spanId = getSpanId();
    return spanId ? spanIdNameMap.get(spanId) : undefined;
  };

  return {
    getSpanId,
    getSpanName,
    getTraceId,
    withSpan,
    addSpanData,
  };
};
