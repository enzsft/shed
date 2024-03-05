export interface ReadEnvironmentVariableOptions<T extends boolean> {
  required: T;
}

export type EnvironmentVariableResult<T> = T extends true ? string : string | undefined;

/**
 * Read an environment variable.
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
