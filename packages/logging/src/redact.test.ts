import { redact } from "./redact";

const object = {
  a: 1,
  b: "2",
  c: "3",
  d: null,
  e: undefined,
  f: {
    a: 1,
    b: "2",
    c: "3",
    d: null,
    e: undefined,
  },
  g: [
    {
      a: 1,
      b: "2",
      c: "3",
      d: null,
      e: undefined,
    },
  ],
  firstName: "John",
  firstname: "John",
  first_name: "John",
  f_irst_na_me: "John",
  "first-name": "John",
  "fi-rst-name": "John",
  "first.name": "John",
  "first.nam.e": "John",
  "first name": "John",
  "fi rst name": "John",
};

it("should not redact anything", () => {
  expect(redact(object, { keysToRedact: [] })).toEqual(object);
});

it("should return input if falsy value passed in", () => {
  // @ts-expect-error
  expect(redact(false, { keysToRedact: [] })).toEqual(false);
  // @ts-expect-error
  expect(redact(null, { keysToRedact: [] })).toEqual(null);
  // @ts-expect-error
  expect(redact(undefined, { keysToRedact: [] })).toEqual(undefined);
});

it("should should redact object", () => {
  expect(
    redact(object, {
      keysToRedact: ["b"],
    }),
  ).toEqual({
    a: 1,
    b: "<redacted>",
    c: "3",
    d: null,
    e: undefined,
    f: {
      a: 1,
      b: "<redacted>",
      c: "3",
      d: null,
      e: undefined,
    },
    g: [
      {
        a: 1,
        b: "<redacted>",
        c: "3",
        d: null,
        e: undefined,
      },
    ],
    firstName: "John",
    firstname: "John",
    first_name: "John",
    f_irst_na_me: "John",
    "first-name": "John",
    "fi-rst-name": "John",
    "first.name": "John",
    "first.nam.e": "John",
    "first name": "John",
    "fi rst name": "John",
  });
});

it("should not redact null", () => {
  expect(redact(object, { keysToRedact: ["d"] })).toEqual(object);
});

it("should not redact undefined", () => {
  expect(redact(object, { keysToRedact: ["e"] })).toEqual(object);
});

it("should normalise keys", () => {
  expect(redact(object, { keysToRedact: ["firstName"] })).toEqual({
    a: 1,
    b: "2",
    c: "3",
    d: null,
    e: undefined,
    f: {
      a: 1,
      b: "2",
      c: "3",
      d: null,
      e: undefined,
    },
    g: [
      {
        a: 1,
        b: "2",
        c: "3",
        d: null,
        e: undefined,
      },
    ],
    firstName: "<redacted>",
    firstname: "<redacted>",
    first_name: "<redacted>",
    f_irst_na_me: "<redacted>",
    "first-name": "<redacted>",
    "fi-rst-name": "<redacted>",
    "first.name": "<redacted>",
    "first.nam.e": "<redacted>",
    "first name": "<redacted>",
    "fi rst name": "<redacted>",
  });
});

it("should use provided redaction value", () => {
  expect(redact(object, { keysToRedact: ["b"], redactionValue: "###" })).toEqual({
    a: 1,
    b: "###",
    c: "3",
    d: null,
    e: undefined,
    f: {
      a: 1,
      b: "###",
      c: "3",
      d: null,
      e: undefined,
    },
    g: [
      {
        a: 1,
        b: "###",
        c: "3",
        d: null,
        e: undefined,
      },
    ],
    firstName: "John",
    firstname: "John",
    first_name: "John",
    f_irst_na_me: "John",
    "first-name": "John",
    "fi-rst-name": "John",
    "first.name": "John",
    "first.nam.e": "John",
    "first name": "John",
    "fi rst name": "John",
  });
});

// eslint-disable-next-line jest/expect-expect,jest/no-disabled-tests
it.skip("benchmark (for development use only)", () => {
  const object = {
    a: 1,
    b: "2",
    c: "3",
    d: null,
    e: undefined,
    f: {
      a: 1,
      b: "2",
      c: "3",
      d: null,
      e: undefined,
    },
    g: [
      {
        a: 1,
        b: "2",
        c: "3",
        d: null,
        e: undefined,
      },
    ],
    firstName: "John",
    firstname: "John",
    first_name: "John",
    f_irst_na_me: "John",
    "first-name": "John",
    "fi-rst-name": "John",
    "first.name": "John",
    "first.nam.e": "John",
    "first name": "John",
    "fi rst name": "John",
  };

  const keysToRedact = ["a", "b", "c", "fake", "first name", "first-name", "first.name", "first name"];

  const redactionValue = "<redacted>";

  const iterations = 1000000;

  console.time("redact");
  for (let i = 0; i < iterations; i++) {
    redact(object, { keysToRedact, redactionValue });
  }
  console.timeEnd("redact");
});
