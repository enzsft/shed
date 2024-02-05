import "@testing-library/jest-dom";
import * as React from "react";
import { toHaveNoViolations } from "jest-axe";

global.React = React;

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

expect.extend(toHaveNoViolations);
