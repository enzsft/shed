# Styles

Utilities to work with styles.

## Installation

```sh
npm install @enzsft/styles
```

## Usage

Concatenate styles and optimise whitespace and conditionally apply styles.

```tsx
import { clsx } from "@enzsft/styles";

clsx("one", "two", "three");
// one two three

clsx("one", false && "two", "three");
// one three
```

Apply the first truthy style.

```tsx
import { fclsx } from "@enzsft/styles";

fclsx("one", "two", "three");
// one

fclsx(false && "one", false && "two", "three");
// three
```

Build styles from an object.

```tsx
import { oclsx } from "@enzsft/styles";

const styles = oclsx({
  one: "one",
  two: "two",
  three: "three",
});

styles({
  one: true,
  two: false,
  three: true,
});
// one three

styles({
  three: true,
});
// three
```
