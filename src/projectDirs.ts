import { baseDirs } from "../mod.ts";
import { getOS } from "./_runtime.ts";

/** Platform-specific directories for a specific application. */
export interface ProjectDirs {
  /** Directory for project-specific cached data. */
  cacheDir: string;
  /** Directory for project-specific configuration files. */
  configDir: string;
  /** Directory for project-specific data files. */
  dataDir: string;
  /** Directory for project-specific local (non-roaming) data files. */
  dataLocalDir: string;
  /** Directory for project-specific preference/settings files. */
  preferenceDir: string;
}

/**
 * Returns platform-specific project directories for the given application
 * identity.
 *
 * - On **Linux** only the `application` segment is used, following the XDG
 *   Base Directory Specification.
 * - On **macOS** paths use the reverse-DNS bundle-ID style:
 *   `qualifier.organization.application`.
 * - On **Windows** paths use `organization\application`.
 *
 * Compatible with Deno, Node.js, and Bun.
 *
 * @param qualifier - Reverse-DNS qualifier, e.g. `"com"`.
 * @param organization - Organisation name, e.g. `"example"`.
 * @param application - Application name, e.g. `"MyApp"`.
 * @returns A {@link ProjectDirs} object with all resolved directory paths.
 *
 * @example
 * ```ts
 * import { projectDirs } from "./mod.ts";
 * const dirs = projectDirs.setup("com", "example", "MyApp");
 * console.log(dirs.configDir);
 * // Linux:   /home/user/.config/MyApp
 * // macOS:   /Users/user/Library/Application Support/com.example.MyApp
 * // Windows: C:\Users\user\AppData\Roaming\example\MyApp
 * ```
 */
export function setup(
  qualifier: string,
  organization: string,
  application: string,
): ProjectDirs {
  const base = baseDirs.setup();
  const dirs: ProjectDirs = {
    cacheDir: "",
    configDir: "",
    dataDir: "",
    dataLocalDir: "",
    preferenceDir: "",
  };

  switch (getOS()) {
    case "linux":
      dirs.cacheDir = `${base.cacheDir}/${application}`;
      dirs.configDir = `${base.configDir}/${application}`;
      dirs.dataDir = `${base.dataDir}/${application}`;
      dirs.dataLocalDir = `${base.dataLocalDir}/${application}`;
      dirs.preferenceDir = `${base.preferenceDir}/${application}`;
      break;

    case "darwin":
      dirs.cacheDir =
        `${base.cacheDir}/${qualifier}.${organization}.${application}`;
      dirs.configDir =
        `${base.configDir}/${qualifier}.${organization}.${application}`;
      dirs.dataDir =
        `${base.dataDir}/${qualifier}.${organization}.${application}`;
      dirs.dataLocalDir =
        `${base.dataLocalDir}/${qualifier}.${organization}.${application}`;
      dirs.preferenceDir =
        `${base.preferenceDir}/${qualifier}.${organization}.${application}`;
      break;

    case "windows":
      dirs.cacheDir = `${base.cacheDir}\\${organization}\\${application}`;
      dirs.configDir = `${base.configDir}\\${organization}\\${application}`;
      dirs.dataDir = `${base.dataDir}\\${organization}\\${application}`;
      dirs.dataLocalDir =
        `${base.dataLocalDir}\\${organization}\\${application}`;
      dirs.preferenceDir =
        `${base.preferenceDir}\\${organization}\\${application}`;
      break;
  }

  return dirs;
}
