import { baseDirs } from "../mod.ts";

export interface UserDirs {
  /** The user's home directory. */
  homeDir: string;
  /** Directory for music files. */
  musicDir: string;
  /** The user's desktop directory. */
  desktopDir: string;
  /** Directory for document files. */
  documentDir: string;
  /** Directory for downloaded files. */
  downloadDir: string;
  /** Directory for user-installed fonts. */
  fontDir: string;
  /** Directory for picture/image files. */
  pictureDir: string;
  /** Directory for publicly shared files. */
  publicDir: string;
  /** Directory for video files. */
  videoDir: string;
  /** Directory for document templates. */
  templateDir: string;
  /** Directory for trashed files. */
  trashDir: string;
}

/**
 * Returns platform-specific user directories for the current user.
 *
 * On Linux, XDG user-dir environment variables (e.g. `XDG_MUSIC_DIR`,
 * `XDG_DESKTOP_DIR`) are respected when set, falling back to conventional
 * defaults otherwise.
 *
 * @returns A {@link UserDirs} object with all resolved directory paths.
 *
 * @example
 * ```ts
 * import { userDirs } from "./mod.ts";
 * const dirs = userDirs.setup();
 * console.log(dirs.downloadDir); // e.g. /home/user/Downloads
 * ```
 */
export function setup(): UserDirs {
  const base = baseDirs.setup();
  const dirs: UserDirs = {
    homeDir: base.homeDir,
    musicDir: "",
    desktopDir: "",
    documentDir: "",
    downloadDir: "",
    fontDir: "",
    pictureDir: "",
    publicDir: "",
    videoDir: "",
    templateDir: "",
    trashDir: "",
  };

  switch (Deno.build.os) {
    case "linux":
      dirs.musicDir = Deno.env.get("XDG_MUSIC_DIR") || `${dirs.homeDir}/Music`;
      dirs.desktopDir = Deno.env.get("XDG_DESKTOP_DIR") ||
        `${dirs.homeDir}/Desktop`;
      dirs.documentDir = Deno.env.get("XDG_DOCUMENTS_DIR") ||
        `${dirs.homeDir}/Documents`;
      dirs.downloadDir = Deno.env.get("XDG_DOWNLOAD_DIR") ||
        `${dirs.homeDir}/Downloads`;
      dirs.fontDir = `${Deno.env.get("XDG_DATA_HOME") ?? base.dataDir}/fonts`;
      dirs.pictureDir = Deno.env.get("XDG_PICTURES_DIR") ||
        `${dirs.homeDir}/Pictures`;
      dirs.publicDir = Deno.env.get("XDG_PUBLICSHARE_DIR") ||
        `${dirs.homeDir}/Public`;
      dirs.videoDir = Deno.env.get("XDG_VIDEOS_DIR") ||
        `${dirs.homeDir}/Videos`;
      dirs.templateDir = Deno.env.get("XDG_TEMPLATES_DIR") ||
        `${dirs.homeDir}/Templates`;
      dirs.trashDir = `${base.dataDir}/Trash`;
      break;

    case "darwin":
      dirs.musicDir = `${dirs.homeDir}/Music`;
      dirs.desktopDir = `${dirs.homeDir}/Desktop`;
      dirs.documentDir = `${dirs.homeDir}/Documents`;
      dirs.downloadDir = `${dirs.homeDir}/Downloads`;
      dirs.fontDir = `${dirs.homeDir}/Library/Fonts`;
      dirs.pictureDir = `${dirs.homeDir}/Pictures`;
      dirs.publicDir = `${dirs.homeDir}/Public`;
      dirs.videoDir = `${dirs.homeDir}/Movies`;
      dirs.templateDir = "virtualHome";
      dirs.trashDir = `${dirs.homeDir}/.Trash`;
      break;

    case "windows":
      dirs.musicDir = `${dirs.homeDir}\\Music`;
      dirs.desktopDir = `${dirs.homeDir}\\Desktop`;
      dirs.documentDir = `${dirs.homeDir}\\Documents`;
      dirs.downloadDir = `${dirs.homeDir}\\Downloads`;
      dirs.fontDir = "C:\\Windows\\fonts";
      dirs.pictureDir = `${dirs.homeDir}\\Pictures`;
      dirs.publicDir = `${dirs.homeDir}\\Public`;
      dirs.videoDir = `${dirs.homeDir}\\Videos`;
      dirs.templateDir =
        `${dirs.homeDir}\\AppData\\Roaming\\Microsoft\\Windows\\Templates`;
      dirs.trashDir = "virtualHome";
      break;
  }

  return dirs;
}
