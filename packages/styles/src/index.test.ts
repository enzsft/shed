import { clsx, fclsx, oclsx } from ".";

describe("clsx", () => {
  it("should return a string of class names", () => {
    expect(clsx("foo", "bar")).toEqual("foo bar");
    expect(clsx(" foo ", " bar ")).toEqual("foo bar");
    expect(clsx("foo", "bar hello   world")).toEqual("foo bar hello world");
    expect(clsx("   ", "foo", " ", "bar", "")).toEqual("foo bar");
    expect(
      clsx(
        `new
    line
hello `,
        "world ",
        "   ",
      ),
    ).toEqual("new line hello world");
  });

  it("should ignore falsey values", () => {
    expect(clsx("foo", false, "bar")).toEqual("foo bar");
    expect(clsx("foo", undefined, "bar")).toEqual("foo bar");
    expect(clsx("foo", null, "bar")).toEqual("foo bar");
    expect(clsx("foo", "", "bar")).toEqual("foo bar");
    expect(clsx("foo", "bar", false)).toEqual("foo bar");
    expect(clsx("foo", "bar", undefined)).toEqual("foo bar");
    expect(clsx("foo", "bar", null)).toEqual("foo bar");
    expect(clsx("foo", "bar", "")).toEqual("foo bar");
  });
});

describe("fclsx", () => {
  it("should return styles based on first true condition", () => {
    const result = fclsx(false, "bar", "default");

    expect(result).toEqual("bar");
  });

  it("should return default styles if no condition is true", () => {
    const result = fclsx(false, undefined, null, "default");

    expect(result).toEqual("default");
  });

  it("should return empty string if nothing is truthy", () => {
    const result = fclsx(false, undefined, null);

    expect(result).toEqual("");
  });
});

describe("oclsx", () => {
  const styles = oclsx({
    primary: "primary",
    secondary: "secondary",
    tertiary: {
      disabled: "tertiary-disabled",
      active: "tertiary-active",
    },
  });

  it("should return enabled styles", () => {
    expect(
      styles({
        primary: true,
        secondary: false,
        tertiary: {
          active: true,
        },
      }),
    ).toEqual("primary tertiary-active");
  });

  it("should return no styles when none enabled", () => {
    expect(
      styles({
        primary: false,
      }),
    ).toEqual("");
  });

  it("should ignore invalid properties", () => {
    expect(
      oclsx({
        primary: "primary",
        secondary: "secondary",
        // @ts-expect-error
        invalid: 123,
      })({
        primary: true,
        secondary: true,
        invalid: true,
      }),
    ).toEqual("primary secondary");
  });
});
