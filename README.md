# directories

> A Deno port of Rust's [`directories`](https://crates.io/crates/directories)
> crate. Provides platform-specific base, user, and project directories on
> Linux, macOS, and Windows.

[![CI](https://github.com/jheysaaz/directories-deno/actions/workflows/ci.yml/badge.svg)](https://github.com/jheysaaz/directories-deno/actions/workflows/ci.yml)

## Usage

```typescript
import {
  baseDirs,
  projectDirs,
  userDirs,
} from "https://deno.land/x/directories/mod.ts";

const base = baseDirs.setup();
console.log(base.cacheDir);
// Linux:   /home/alice/.cache
// macOS:   /Users/alice/Library/Caches
// Windows: C:\Users\alice\AppData\Local

const user = userDirs.setup();
console.log(user.musicDir);
// Linux:   /home/alice/Music
// macOS:   /Users/alice/Music
// Windows: C:\Users\alice\Music

const project = projectDirs.setup("com", "acme", "directories");
console.log(project.preferenceDir);
// Linux:   /home/alice/.config/directories
// macOS:   /Users/alice/Library/Preferences/com.acme.directories
// Windows: C:\Users\alice\AppData\Roaming\acme\directories
```

## API

### `baseDirs.setup(): BaseDirs`

Returns platform-specific base directories. On Linux,
[XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/latest/)
environment variables are respected.

| Field           | Linux                                 | macOS                           | Windows                         |
| --------------- | ------------------------------------- | ------------------------------- | ------------------------------- |
| `homeDir`       | `$HOME`                               | `$HOME`                         | `%USERPROFILE%`                 |
| `cacheDir`      | `$XDG_CACHE_HOME` \| `~/.cache`       | `~/Library/Caches`              | `%USERPROFILE%\AppData\Local`   |
| `configDir`     | `$XDG_CONFIG_HOME` \| `~/.config`     | `~/Library/Application Support` | `%USERPROFILE%\AppData\Roaming` |
| `dataDir`       | `$XDG_DATA_HOME` \| `~/.local/share`  | `~/Library/Application Support` | `%USERPROFILE%\AppData\Roaming` |
| `dataLocalDir`  | same as `dataDir`                     | `~/Library/Application Support` | `%USERPROFILE%\AppData\Local`   |
| `preferenceDir` | same as `configDir`                   | `~/Library/Preferences`         | `%USERPROFILE%\AppData\Roaming` |
| `stateDir`      | `$XDG_STATE_HOME` \| `~/.local/state` | same as `dataDir`               | same as `dataLocalDir`          |
| `runtimeDir`    | `$XDG_RUNTIME_DIR` \| `"virtualHome"` | `~/Library/Application Support` | `%USERPROFILE%\AppData\Local`   |
| `executableDir` | `~/.local/bin`                        | `"virtualHome"`                 | `"virtualHome"`                 |

### `userDirs.setup(): UserDirs`

Returns platform-specific user directories. On Linux, XDG user-dir environment
variables (e.g. `XDG_MUSIC_DIR`) are respected.

| Field         | Linux                                            | macOS             | Windows                                         |
| ------------- | ------------------------------------------------ | ----------------- | ----------------------------------------------- |
| `homeDir`     | `$HOME`                                          | `$HOME`           | `%USERPROFILE%`                                 |
| `desktopDir`  | `$XDG_DESKTOP_DIR` \| `~/Desktop`                | `~/Desktop`       | `~\Desktop`                                     |
| `documentDir` | `$XDG_DOCUMENTS_DIR` \| `~/Documents`            | `~/Documents`     | `~\Documents`                                   |
| `downloadDir` | `$XDG_DOWNLOAD_DIR` \| `~/Downloads`             | `~/Downloads`     | `~\Downloads`                                   |
| `musicDir`    | `$XDG_MUSIC_DIR` \| `~/Music`                    | `~/Music`         | `~\Music`                                       |
| `pictureDir`  | `$XDG_PICTURES_DIR` \| `~/Pictures`              | `~/Pictures`      | `~\Pictures`                                    |
| `videoDir`    | `$XDG_VIDEOS_DIR` \| `~/Videos`                  | `~/Movies`        | `~\Videos`                                      |
| `publicDir`   | `$XDG_PUBLICSHARE_DIR` \| `~/Public`             | `~/Public`        | `~\Public`                                      |
| `fontDir`     | `$XDG_DATA_HOME/fonts` \| `~/.local/share/fonts` | `~/Library/Fonts` | `C:\Windows\fonts`                              |
| `templateDir` | `$XDG_TEMPLATES_DIR` \| `~/Templates`            | `"virtualHome"`   | `~\AppData\Roaming\Microsoft\Windows\Templates` |
| `trashDir`    | `~/.local/share/Trash`                           | `~/.Trash`        | `"virtualHome"`                                 |

### `projectDirs.setup(qualifier, organization, application): ProjectDirs`

Returns application-specific directories derived from `baseDirs`. Path format
varies per platform:

- **Linux** — `<base>/<application>`
- **macOS** — `<base>/<qualifier>.<organization>.<application>`
- **Windows** — `<base>\<organization>\<application>`

| Field           | Description                         |
| --------------- | ----------------------------------- |
| `cacheDir`      | Application cache directory         |
| `configDir`     | Application configuration directory |
| `dataDir`       | Application data directory          |
| `dataLocalDir`  | Application local data directory    |
| `preferenceDir` | Application preferences directory   |

## Notes

- Fields that have no meaningful value on a given platform return the string
  `"virtualHome"` as a sentinel.
- On Linux, `$HOME` falls back to `"virtualHome"` when the environment variable
  is not set.

## Development

```sh
deno task test    # run tests
deno task check   # type-check
deno task lint    # lint
deno task fmt     # format
```

## License

MIT
