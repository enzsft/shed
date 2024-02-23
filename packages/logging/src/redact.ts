const normalisedKeys = new Map<string, string>();

function normaliseKey(key: string): string {
  let normalised = normalisedKeys.get(key);

  if (normalised === undefined) {
    normalised = key.toLowerCase().replace(/ /g, "").replace(/\./g, "").replace(/-/g, "").replace(/_/g, "");
    normalisedKeys.set(key, normalised);
    return normalised;
  }

  return normalised;
}

function notEmptyObject(obj: object): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]" && Object.keys(obj).length > 0;
}

export interface RedactOptions {
  keysToRedact: string[];
  redactionValue?: string;
}

export function redact(object: Record<string, unknown>, options: RedactOptions): Record<string, unknown> {
  if (!object) {
    return object;
  }

  if (options.keysToRedact.length === 0) {
    return object;
  }

  const redactionValue = options.redactionValue ?? "<redacted>";
  const normalisedKeysToRedact = options.keysToRedact.map(normaliseKey);

  function innerRedact<T>(input: T): T {
    switch (typeof input) {
      case "string":
      case "number":
      case "boolean":
      case "undefined":
        return input;

      case "object": {
        if (Array.isArray(input)) {
          return input.map((item) => innerRedact(item as unknown)) as T;
        } else if (input === null || input instanceof Date || input instanceof Set || input instanceof Map) {
          return input;
        } else if (notEmptyObject(input)) {
          const result: Record<string, unknown> = {};

          for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
            if (value && normalisedKeysToRedact.includes(normaliseKey(key))) {
              result[key] = redactionValue;
            } else {
              result[key] = innerRedact(value);
            }
          }

          return result as T;
        } else {
          return input;
        }
      }
    }

    return innerRedact(input);
  }

  return innerRedact(object);
}
