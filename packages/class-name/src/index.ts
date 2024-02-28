/**
 * Joins classes together and tidies up whitespace. Falsy values are ignored.
 *
 * @param classNames Array of class names to join.
 * @returns A string of class names joined together.
 */
export const classes = (...classNames: (false | string | undefined | null)[]) => {
  return classNames
    .map((a) => a && a.replace(/\n/g, " ").trim().split(" ").filter(Boolean).join(" "))
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

type NestedObjectOfBoolean<T> = {
  [K in keyof T]?: T[K] extends object ? NestedObjectOfBoolean<T[K]> : boolean;
};

type NestedObjectOfStrings = { [key: string]: string | NestedObjectOfStrings };

/**
 * Get styles from a styles object based on enabled styles.
 *
 * @param styles The styles object
 * @param enabledStyles The enabled styles
 * @returns A string of class names joined together
 */
export const getStyles = <TStyles extends NestedObjectOfStrings>(
  styles: TStyles,
  enabledStyles: NestedObjectOfBoolean<TStyles>,
): string => {
  const keys = Object.keys(enabledStyles);
  let currentStyles = "";

  for (const key of keys) {
    const isEnabled = Boolean(enabledStyles[key]);

    if (!isEnabled) {
      continue;
    }

    const currentProperty = styles[key];

    switch (typeof currentProperty) {
      case "object": {
        const subStyles = getStyles(
          currentProperty,
          enabledStyles[key] as NestedObjectOfBoolean<typeof currentProperty>,
        );
        currentStyles = classes(currentStyles, subStyles);
        break;
      }
      case "string": {
        currentStyles = classes(currentStyles, currentProperty);
        break;
      }
      default: {
        break;
      }
    }
  }

  return currentStyles;
};
