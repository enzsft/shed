const normalizedKeys: Record<string, string> = {};

const normalizeKey = (key: string): string => {
  // important we memoize this as it a substantial time saver when calling with
  // the same collection of redacted keys
  if (!normalizedKeys[key]) {
    normalizedKeys[key] = key.toLowerCase().replace(/ /g, "").replace(/\./g, "").replace(/-/g, "").replace(/_/g, "");
  }

  return normalizedKeys[key];
};

export interface RedactOptions {
  keysToRedact: string[];
  redactionValue?: string;
}

export const redact = (object: Record<string, unknown>, options: RedactOptions): Record<string, unknown> => {
  if (!object) {
    return object;
  }
  if (options.keysToRedact.length === 0) {
    return object;
  }

  const normalizedKeysToRedact = options.keysToRedact.map((key) => normalizeKey(key));
  const redactionValue = options.redactionValue ?? "<redacted>";

  const result: Record<string, unknown> = {};

  const keys = Object.keys(object);

  // for loop with continue statements is much faster than forEach with return statements
  for (const key of keys) {
    const value = object[key];
    if (!value) {
      result[key] = value;

      continue;
    }

    if (normalizedKeysToRedact.includes(normalizeKey(key))) {
      result[key] = redactionValue;

      continue;
    }

    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        redact(item as Record<string, unknown>, {
          keysToRedact: normalizedKeysToRedact,
          redactionValue: options.redactionValue,
        }),
      );

      continue;
    }

    if (typeof value === "object" && !(value instanceof Date)) {
      result[key] = redact(value as Record<string, unknown>, {
        keysToRedact: normalizedKeysToRedact,
        redactionValue: options.redactionValue,
      });

      continue;
    }

    result[key] = value;
  }

  return result;
};
