import { readEnvironmentVariable } from "./index";

afterEach(() => {
  delete process.env.TEST_VAR;
});

it("should read environment variable", () => {
  process.env.TEST_VAR = "abc-123";
  const value = readEnvironmentVariable("TEST_VAR");

  expect(value).toBe("abc-123");
});

it("should throw error if environment variable is not defined", () => {
  expect(() => readEnvironmentVariable("TEST_VAR", { required: true })).toThrow(
    "Environment variable TEST_VAR is not defined",
  );
});
