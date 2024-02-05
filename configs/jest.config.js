const path = require("path");

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [path.resolve(__dirname, "jest.setup.ts")],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: path.resolve(process.cwd(), "tsconfig.types.json"),
        diagnostics: false,
      },
    ],
  },
  rootDir: process.cwd(),
};

module.exports = config;
