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

    if (value) {
      attributes[attributeKey] = value.toString();
    }
  }

  return attributes;
};

/**
 * Get the current OpenTelemetry tracing context
 */
export const getOpenTelemetryTracingContext = (): TracingContext => {
  const activeSpan = trace.getActiveSpan();
  const spanContext = activeSpan?.spanContext();

  return {
    traceId: spanContext?.traceId,
    spanId: spanContext?.spanId,
    addSpanData: (data: LogData) => {
      if (!activeSpan) {
        return;
      }

      const attributes = extractAttributes(data);
      activeSpan.setAttributes(attributes);
    },
  };
};
