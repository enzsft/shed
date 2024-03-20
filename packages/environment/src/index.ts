export interface ReadEnvironmentVariableOptions<T extends boolean> {
  /**
   * Whether the environment variable is required.
   */
  required: T;
}

export type EnvironmentVariableResult<T> = T extends true ? string : string | undefined;

/**
 * Read an environment variable.
 *
 * @param name The name of the environment variable
 * @param options Options for reading the environment variable
 */
export const readEnvironmentVariable = <T extends boolean>(
  name: string,
  options?: ReadEnvironmentVariableOptions<T>,
): EnvironmentVariableResult<T> => {
  if (options?.required && !process.env[name]) {
    throw new Error(`Environment variable ${name} is not defined`);
  }

  return process.env[name]!;
};
