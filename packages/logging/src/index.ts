import merge from "deepmerge";
import { v4 } from "uuid";
import { redact } from "./redact";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogDataType = number | string | boolean | null;

export type LogData = Record<
  string,
  LogDataType | Record<string, LogDataType> | (LogDataType | Record<string, LogDataType>)[]
>;

export interface LoggerOptions {
  /**
   * The service name to identify the source of the logs
   */
  service: string;
  /**
   * The data to be added to every log message
   */
  data?: LogData;
  /**
   * The trace ID is used to identify a specific trace.
   * When using the open telemetry tracing context, this will be ignored
   * if a trace ID is provided by the active span.
   */
  traceId?: string;
  /**
   * The span ID is used to identify a specific span within a trace.
   * When using the open telemetry tracing context, this will be ignored
   * if a span ID is provided by the active span.
   */
  spanId?: string;
  /**
   * The span name is used to identify a specific span within a trace.
   * When using the open telemetry tracing context, this will be ignored
   * when within a span created by the tracer via `withSpan`.
   */
  spanName?: string;
}

export interface LogPayload {
  /**
   * The message to log
   */
  message: string;
  /**
   * The data to be added to the log
   */
  data?: LogData;
}

export interface ErrorLogPayload {
  /**
   * The error to log
   */
  error?: {
    /**
     * The error message
     */
    message: string;
    /**
     * The error name
     */
    name?: string;
    /**
     * The error stacktrace
     */
    stacktrace?: string;
    /**
     * The error code
     */
    code?: string;
  };
}

export interface LiteralErrorLogPayload {
  /**
   * The error to log
   */
  error?: Error;
}

export interface RedactionOptions {
  /**
   * The keys to redact from the object.
   */
  keysToRedact: string[];
}

export interface TracingContext {
  /**
   * Get the span ID, if available. When using the open telemetry
   * tracing context, this will return the span ID of the active span if available.
   *
   * @returns The span ID
   */
  getSpanId: () => string | undefined;
  /**
   * Get the span name, if available. When using the open telemetry
   *
   * @returns The span name
   */
  getSpanName: () => string | undefined;
  /**
   * Get the trace ID, if available. When using the open telemetry
   * tracing context, this will return the trace ID of the active span if available.
   *
   * @returns The trace ID
   */
  getTraceId: () => string | undefined;
  /**
   * Run a function within a new span
   *
   * @param name The name of the span
   * @param fn The function to run within the span
   * @returns The result of the function
   */
  // Can't get this to work with unknown type so need to use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withSpan: <TFn extends () => Promise<any>>(name: string, fn: TFn) => Promise<ReturnType<TFn>>;
  /**
   * Add data to the current span
   *
   * @param data The data to add to the span
   */
  addSpanData: (data: LogData) => void;
}

export interface Logger {
  /**
   * Log a debug message
   */
  debug: (payload: LogPayload) => void;
  /**
   * Log an info message
   */
  info: (payload: LogPayload) => void;
  /**
   * Log a warning message
   */
  warn: (payload: LogPayload) => void;
  /**
   * Log an error message
   */
  error: (payload: LogPayload & ErrorLogPayload & LiteralErrorLogPayload) => void;
  /**
   * Add data to the logger
   */
  withData: (data: LogData) => void;
  /**
   * Add tracing context to the logger
   */
  withTracingContext: (tracingContext: TracingContext) => void;
  /**
   * Add redactions to the logger
   */
  withRedactions: (options: RedactionOptions) => void;
  /**
   * Run a function within a new span. The default basic tracing
   * context does not support nested spans so this will just run
   * the function without creating a new span.
   */
  withSpan: TracingContext["withSpan"];
}

/**
 * Create a new logger
 *
 * @param options The logger options
 */
export const createLogger = (options: LoggerOptions): Logger => {
  const baseLogData = {
    service: options.service,
    data: options.data,
  };

  let tracingContext: TracingContext = {
    getTraceId: () => options.traceId ?? v4(),
    getSpanId: () => options.spanId ?? v4(),
    getSpanName: () => options.spanName,
    withSpan: (name, fn) => {
      console.warn(
        `New span "${name}" not created. Nested spans are not supported in the default tracing context. Please provide a TracingContext implementation.`,
      );

      return fn();
    },
    addSpanData: () => {},
  };

  let keysToRedact: string[] = [];

  const log = (level: LogLevel, payload: LogPayload | (LogPayload & ErrorLogPayload)) => {
    const mergedLogPayload = merge(
      {
        ...baseLogData,
        spanId: tracingContext.getSpanId(),
        spanName: tracingContext.getSpanName(),
        traceId: tracingContext.getTraceId(),
      },
      payload,
    );

    const redactedData = redact(mergedLogPayload.data, { keysToRedact });

    const finalPayload = {
      ...mergedLogPayload,
      data: redactedData,
      level,
      timestamp: Date.now(),
    };

    tracingContext.addSpanData(redactedData as LogData);

    console[level](JSON.stringify(finalPayload));
  };

  const debug = (payload: LogPayload) => {
    log("debug", payload);
  };

  const info = (payload: LogPayload) => {
    log("info", payload);
  };

  const warn = (payload: LogPayload) => {
    log("warn", payload);
  };

  const error = (payload: LogPayload & ErrorLogPayload & LiteralErrorLogPayload) => {
    if (payload.error instanceof Error) {
      payload.error = {
        message: payload.error.message,
        name: payload.error.name,
        stacktrace: payload.error.stack,
        code: payload.error.code,
      };
    }

    log("error", payload);
  };

  const withData = (data: LogData) => {
    baseLogData.data = merge(baseLogData.data ?? {}, data);
  };

  const withTracingContext = (context: TracingContext) => {
    tracingContext = context;
  };

  const withRedactions = (options: RedactionOptions) => {
    keysToRedact = options.keysToRedact;
  };

  return {
    debug,
    info,
    warn,
    error,
    withData,
    withTracingContext,
    withRedactions,
    withSpan: (name, fn) => tracingContext.withSpan(name, fn),
  };
};
