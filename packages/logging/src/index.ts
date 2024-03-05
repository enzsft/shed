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
  service: string;
  data?: LogData;
  traceId?: string;
  spanId?: string;
}

export interface LogPayload {
  message: string;
  data?: LogData;
}

export interface ErrorLogPayload {
  error?: {
    message: string;
    name?: string;
    stacktrace?: string;
    code?: string;
  };
}

export interface LiteralErrorLogPayload {
  error?: Error;
}

export interface RedactionOptions {
  keysToRedact: string[];
}

export interface TracingContext {
  traceId?: string;
  spanId?: string;
  addSpanData: (data: LogData) => void;
}

/**
 * Isomorphic logger
 */
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
}

/**
 * Create a new logger
 */
export const createLogger = (options: LoggerOptions): Logger => {
  const baseLogData = {
    service: options.service,
    data: options.data,
  };

  let tracingContext: TracingContext = {
    traceId: options.traceId ?? v4(),
    spanId: options.spanId ?? v4(),
    addSpanData: () => {},
  };

  let keysToRedact: string[] = [];

  const log = (level: LogLevel, payload: LogPayload | (LogPayload & ErrorLogPayload)) => {
    const mergedLogPayload = merge(
      {
        ...baseLogData,
        spanId: tracingContext.spanId,
        traceId: tracingContext.traceId,
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

    tracingContext.addSpanData(finalPayload as LogData);

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
  };
};
