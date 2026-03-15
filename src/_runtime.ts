// Ambient declaration so deno check does not flag the process global.
declare const process:
  | {
    platform: string;
    env: Record<string, string | undefined>;
  }
  | undefined;

/** Canonical OS identifier used throughout this library. */
export type OS = "linux" | "darwin" | "windows";

/**
 * Returns the current operating system as one of the three canonical strings
 * the library uses in its switch statements.
 *
 * Detection order:
 *   1. Deno  — `Deno.build.os`  (already "linux" | "darwin" | "windows")
 *   2. Node / Bun — `process.platform`  ("linux" | "darwin" | "win32")
 *
 * Falls back to `"linux"` when neither global is available.
 */
export function getOS(): OS {
  if (typeof Deno !== "undefined" && Deno?.build?.os) {
    const os = Deno.build.os;
    if (os === "linux" || os === "darwin" || os === "windows") return os;
  }

  if (typeof process !== "undefined" && process?.platform) {
    const p = process.platform;
    if (p === "win32") return "windows";
    if (p === "darwin") return "darwin";
    return "linux";
  }

  return "linux";
}

/**
 * Returns the value of the named environment variable, or `undefined` when
 * the variable is not set.
 *
 * Detection order:
 *   1. Deno  — `Deno.env.get(key)`
 *   2. Node / Bun — `process.env[key]`
 */
export function getEnv(key: string): string | undefined {
  if (typeof Deno !== "undefined" && typeof Deno?.env?.get === "function") {
    return Deno.env.get(key);
  }

  if (typeof process !== "undefined" && process?.env) {
    const value = process.env[key];
    return value === undefined ? undefined : String(value);
  }

  return undefined;
}

/**
 * Sets an environment variable.
 *
 * Used only in tests. Prefer `getEnv` for reads in library code.
 */
export function setEnv(key: string, value: string): void {
  if (typeof Deno !== "undefined" && typeof Deno?.env?.set === "function") {
    Deno.env.set(key, value);
    return;
  }

  if (typeof process !== "undefined" && process?.env) {
    process.env[key] = value;
  }
}

/**
 * Deletes an environment variable.
 *
 * Used only in tests. Prefer `getEnv` for reads in library code.
 */
export function deleteEnv(key: string): void {
  if (typeof Deno !== "undefined" && typeof Deno?.env?.delete === "function") {
    Deno.env.delete(key);
    return;
  }

  if (typeof process !== "undefined" && process?.env) {
    delete process.env[key];
  }
}
