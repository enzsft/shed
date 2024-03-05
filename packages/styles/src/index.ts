/**
 * Concatenate styles and optimise whitespace and conditionally apply styles.
 */
export const clsx = (...classNames: (false | string | undefined | null)[]) => {
  return classNames
    .map((a) => a && a.replace(/\n/g, " ").trim().split(" ").filter(Boolean).join(" "))
    .filter(Boolean)
    .join(" ");
};

/**
 * Apply the first truthy style.
 */
export const fclsx = (...classNames: (false | string | undefined | null)[]): string => {
  const result = classNames.find((s) => typeof s === "string");

  return result ? result : "";
};

type NestedObjectOfBoolean<T> = {
  [K in keyof T]?: T[K] extends object ? NestedObjectOfBoolean<T[K]> : boolean;
};

type NestedObjectOfStrings = { [key: string]: string | NestedObjectOfStrings };

/**
 * Build styles from an object.
 */
export const oclsx = <TStyles extends NestedObjectOfStrings>(
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
        const subStyles = oclsx(currentProperty, enabledStyles[key] as NestedObjectOfBoolean<typeof currentProperty>);
        currentStyles = clsx(currentStyles, subStyles);
        break;
      }
      case "string": {
        currentStyles = clsx(currentStyles, currentProperty);
        break;
      }
      default: {
        break;
      }
    }
  }

  return currentStyles;
};
