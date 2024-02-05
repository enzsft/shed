# Props

Utilities for constructing props.

## Installation

```sh
npm install @enzsft/props
```

## Usage

Exclude props from a props object:

```tsx
import { excludeProps } from "@enzsft/props";

const props = {
  foo: "bar",
  className: "bg-red",
};

console.log(excludeProps(props, ["className"]));
// { foo: "bar" }
```

Include props from a props object:

```tsx
import { includeProps } from "@enzsft/props";

const props = {
  foo: "bar",
  className: "bg-red",
};

console.log(includeProps(props, ["className"]));
// { className: "bg-red" }
```
