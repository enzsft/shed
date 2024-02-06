export interface ReadEnvironmentVariableOptions<T extends boolean> {
  required: T;
}

export type EnvironmentVariableResult<T> = T extends true ? string : string | undefined;

/**
 * Read an environment variable.
 *
 * @param name The name of the variable
 * @param options Optional options for reading the variable
 * @returns Refined props
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
