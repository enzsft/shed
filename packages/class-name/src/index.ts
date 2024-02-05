/**
 * Joins classes together and tidies up whitespace. Falsy values are ignored.
 *
 * @param classNames Array of class names to join.
 * @returns A string of class names joined together.
 */
export const classes = (...classNames: (false | string | undefined | null)[]) => {
  return classNames
    .map((c) => c && c.trim().split(" ").filter(Boolean).join(" "))
    .filter(Boolean)
    .join(" ");
};

/**
 * Chooses the first non-falsey class name.
 *
 * @param classNames Array of class names to join.
 * @returns The first non-falsey class name.
 */
export const firstClasses = (...classNames: (false | string | undefined | null)[]): string => {
  const result = classNames.find((s) => typeof s === "string");

  return result ? result : "";
};
