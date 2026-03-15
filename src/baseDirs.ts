import { getEnv, getOS } from "./_runtime.ts";

/** Platform-specific base directories for the current user. */
export interface BaseDirs {
  /** The user's home directory. */
  homeDir: string;
  /** Directory for cached data. */
  cacheDir: string;
  /** Directory for configuration files. */
  configDir: string;
  /** Directory for data files. */
  dataDir: string;
  /** Directory for local (non-roaming) data files. */
  dataLocalDir: string;
  /** Directory for preference/settings files. */
  preferenceDir: string;
  /** Directory for persistent state data. */
  stateDir: string;
  /** Directory for runtime files (sockets, named pipes, etc.). */
  runtimeDir: string;
  /** Directory for user-installed executables. */
  executableDir: string;
}

/**
 * Returns platform-specific base directories for the current user.
 *
 * On Linux, XDG environment variables (`XDG_CACHE_HOME`, `XDG_CONFIG_HOME`,
 * `XDG_DATA_HOME`, `XDG_STATE_HOME`, `XDG_RUNTIME_DIR`) are respected when
 * set, falling back to XDG-specified defaults otherwise.
 *
 * Compatible with Deno, Node.js, and Bun.
 *
 * @returns A {@link BaseDirs} object with all resolved directory paths.
 *
 * @example
 * ```ts
 * import { baseDirs } from "./mod.ts";
 * const dirs = baseDirs.setup();
 * console.log(dirs.cacheDir); // e.g. /home/user/.cache
 * ```
 */
export function setup(): BaseDirs {
  const dirs: BaseDirs = {
    homeDir: "",
    cacheDir: "",
    configDir: "",
    dataDir: "",
    dataLocalDir: "",
    preferenceDir: "",
    stateDir: "",
    runtimeDir: "",
    executableDir: "",
  };

  switch (getOS()) {
    case "linux":
      dirs.homeDir = getEnv("HOME") || "virtualHome";
      dirs.cacheDir = getEnv("XDG_CACHE_HOME") || `${dirs.homeDir}/.cache`;
      dirs.configDir = getEnv("XDG_CONFIG_HOME") || `${dirs.homeDir}/.config`;
      dirs.dataDir = getEnv("XDG_DATA_HOME") || `${dirs.homeDir}/.local/share`;
      dirs.dataLocalDir = dirs.dataDir;
      dirs.preferenceDir = dirs.configDir;
      dirs.stateDir = getEnv("XDG_STATE_HOME") ||
        `${dirs.homeDir}/.local/state`;
      dirs.runtimeDir = getEnv("XDG_RUNTIME_DIR") || "virtualHome";
      dirs.executableDir = `${dirs.homeDir}/.local/bin`;
      break;

    case "darwin":
      dirs.homeDir = getEnv("HOME") || "virtualHome";
      dirs.cacheDir = `${dirs.homeDir}/Library/Caches`;
      dirs.configDir = `${dirs.homeDir}/Library/Application Support`;
      dirs.dataDir = `${dirs.homeDir}/Library/Application Support`;
      dirs.dataLocalDir = `${dirs.homeDir}/Library/Application Support`;
      dirs.preferenceDir = `${dirs.homeDir}/Library/Preferences`;
      dirs.stateDir = dirs.dataDir;
      dirs.runtimeDir = `${dirs.homeDir}/Library/Application Support`;
      dirs.executableDir = "virtualHome";
      break;

    case "windows":
      dirs.homeDir = getEnv("USERPROFILE") || "virtualHome";
      dirs.cacheDir = `${dirs.homeDir}\\AppData\\Local`;
      dirs.configDir = `${dirs.homeDir}\\AppData\\Roaming`;
      dirs.dataDir = `${dirs.homeDir}\\AppData\\Roaming`;
      dirs.dataLocalDir = `${dirs.homeDir}\\AppData\\Local`;
      dirs.preferenceDir = `${dirs.homeDir}\\AppData\\Roaming`;
      dirs.stateDir = dirs.dataLocalDir;
      dirs.runtimeDir = dirs.dataLocalDir;
      dirs.executableDir = "virtualHome";
      break;
  }

  return dirs;
}
