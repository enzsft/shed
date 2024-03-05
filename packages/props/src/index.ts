// Need to support any for prop types as unknown creates "not assignable" errors down stream
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropValue = any;

/**
 * Returns a new object without the excluded props.
 */
export const excludeProps = <T extends Record<string, PropValue>, K extends keyof T>(props: T, propsToExclude: K[]) => {
  const result = { ...props };

  for (const key of propsToExclude) {
    delete result[key];
  }

  return result;
};

/**
 * Returns a new object with only the included props.
 */
export const includeProps = <T extends Record<string, PropValue>, K extends keyof T>(props: T, propsToInclude: K[]) => {
  const result: Record<K, PropValue> = {} as Record<K, PropValue>;

  for (const key of propsToInclude) {
    if (props[key] !== undefined) {
      result[key] = props[key];
    }
  }

  return result;
};
