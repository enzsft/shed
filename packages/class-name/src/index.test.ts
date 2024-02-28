import { classes, firstClasses, getStyles } from ".";

describe("classes", () => {
  it("should return a string of class names", () => {
    expect(classes("foo", "bar")).toEqual("foo bar");
    expect(classes(" foo ", " bar ")).toEqual("foo bar");
    expect(classes("foo", "bar hello   world")).toEqual("foo bar hello world");
    expect(classes("   ", "foo", " ", "bar", "")).toEqual("foo bar");
    expect(
      classes(
        `new
    line
hello `,
        "world ",
        "   ",
      ),
    ).toEqual("new line hello world");
  });

  it("should ignore falsey values", () => {
    expect(classes("foo", false, "bar")).toEqual("foo bar");
    expect(classes("foo", undefined, "bar")).toEqual("foo bar");
    expect(classes("foo", null, "bar")).toEqual("foo bar");
    expect(classes("foo", "", "bar")).toEqual("foo bar");
    expect(classes("foo", "bar", false)).toEqual("foo bar");
    expect(classes("foo", "bar", undefined)).toEqual("foo bar");
    expect(classes("foo", "bar", null)).toEqual("foo bar");
    expect(classes("foo", "bar", "")).toEqual("foo bar");
  });
});

describe("firstClasses", () => {
  it("should return styles based on first true condition", () => {
    const result = firstClasses(false, "bar", "default");

    expect(result).toEqual("bar");
  });

  it("should return default styles if no condition is true", () => {
    const result = firstClasses(false, undefined, null, "default");

    expect(result).toEqual("default");
  });

  it("should return empty string if nothing is truthy", () => {
    const result = firstClasses(false, undefined, null);

    expect(result).toEqual("");
  });
});

describe("getStyles", () => {
  const styles = {
    primary: "primary",
    secondary: "secondary",
    tertiary: {
      disabled: "tertiary-disabled",
      active: "tertiary-active",
    },
  };

  it("should return enabled styles", () => {
    expect(
      getStyles(styles, {
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
      getStyles(styles, {
        primary: false,
      }),
    ).toEqual("");
  });
});
