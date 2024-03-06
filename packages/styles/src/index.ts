/**
 * Concatenate styles and optimise whitespace and conditionally apply styles.
 */
export const clsx = (...styles: (false | string | undefined | null)[]) => {
  return styles
    .map((a) => a && a.replace(/\n/g, " ").trim().split(" ").filter(Boolean).join(" "))
    .filter(Boolean)
    .join(" ");
};

/**
 * Apply the first truthy style.
 */
export const fclsx = (...styles: (false | string | undefined | null)[]): string => {
  const result = styles.find((s) => typeof s === "string");

  return result ? clsx(result) : "";
};

type NestedObjectOfBoolean<T> = {
  [K in keyof T]?: T[K] extends object ? NestedObjectOfBoolean<T[K]> : boolean;
};

type NestedObjectOfStrings = { [key: string]: string | NestedObjectOfStrings };

/**
 * Build styles from an object.
 */
const internal_oclsx = <TStyles extends NestedObjectOfStrings>(
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
        const subStyles = internal_oclsx(
          currentProperty,
          enabledStyles[key] as NestedObjectOfBoolean<typeof currentProperty>,
        );
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

export const oclsx = <TStyles extends NestedObjectOfStrings>(
  styles: TStyles,
): ((enabledStyles: NestedObjectOfBoolean<TStyles>) => string) => {
  return (enabledStyles) => internal_oclsx(styles, enabledStyles);
};
