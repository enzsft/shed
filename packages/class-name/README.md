# Class name

Utilities to build well formatted className props.

## Installation

```sh
npm install @enzsft/class-name
```

## Usage

Concatenate class names and optimise whitespace:

```tsx
import { classes } from "@enzsft/class-name";

console.log(styles("bg-red ", " text-black", "p-4"));
// bg-red text-black p-4
```

Choose classes based on the first truthy value:

```tsx
import { firstClasses } from "@enzsft/class-name";

let disabled = true;

console.log(firstClasses(disabled && "bg-grey", "bg-white"));
// bg-grey

disabled = false;

console.log(firstClasses(disabled && "bg-grey", "bg-white"));
// bg-white
```

Build styles from an object:

```tsx
import { getStyles } from "@bpp-education-group/scholar-utils";

const exampleStyles = {
  one: "one",
  two: "two",
  three: {
    four: "four",
    five: "five",
  },
};

const styles = getStyles(exampleStyles, {
  one: true,
  three: {
    four: true,
  },
});

console.log(styles);

// one four
```
