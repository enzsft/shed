import { excludeProps, includeProps } from ".";

describe("excludeProps", () => {
  it("should return a new object without the excluded props", () => {
    const props = {
      foo: "bar",
      bar: "baz",
      baz: "foo",
    };

    expect(excludeProps(props, ["foo", "bar"])).toEqual({ baz: "foo" });
  });
});

describe("includeProps", () => {
  it("should return a new object with only the included props", () => {
    const props = {
      foo: "bar",
      bar: "baz",
      baz: "foo",
    };

    expect(includeProps(props, ["foo", "bar"])).toEqual({ foo: "bar", bar: "baz" });
  });

  it("should not inject new props that are flagged to be included if they do not already exist", () => {
    const props = {
      foo: "bar",
      baz: "foo",
    };

    // @ts-ignore - purposefully passing 'bar' in for test
    const result = includeProps(props, ["foo", "bar"]);
    expect(Object.keys(result)).toEqual(["foo"]);
  });
});
