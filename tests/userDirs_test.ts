import { assertEquals, assertMatch } from "jsr:@std/assert@^1.0.19";
import { deleteEnv, getOS, setEnv } from "../src/_runtime.ts";
import { userDirs } from "../mod.ts";

Deno.test("userDirs.setup() returns non-empty strings", () => {
  const dirs = userDirs.setup();
  for (const [key, value] of Object.entries(dirs)) {
    assertEquals(typeof value, "string", `${key} should be a string`);
    assertEquals(value.length > 0, true, `${key} should be non-empty`);
  }
});

Deno.test("userDirs.setup() contains platform-specific segments", () => {
  const dirs = userDirs.setup();

  switch (getOS()) {
    case "linux":
      assertMatch(dirs.musicDir, /Music/);
      assertMatch(dirs.downloadDir, /Downloads/);
      assertMatch(dirs.fontDir, /fonts/);
      assertMatch(dirs.templateDir, /Templates/);
      assertMatch(dirs.trashDir, /Trash/);
      break;

    case "darwin":
      assertMatch(dirs.musicDir, /Music/);
      assertMatch(dirs.videoDir, /Movies/);
      assertMatch(dirs.fontDir, /Library\/Fonts/);
      assertMatch(dirs.trashDir, /\.Trash/);
      assertEquals(dirs.templateDir, "virtualHome");
      break;

    case "windows":
      assertMatch(dirs.musicDir, /Music/);
      assertMatch(dirs.videoDir, /Videos/);
      assertMatch(dirs.publicDir, /Public/);
      assertMatch(dirs.fontDir, /Windows\\fonts/);
      assertMatch(dirs.templateDir, /Templates/);
      assertEquals(dirs.trashDir, "virtualHome");
      break;
  }
});

Deno.test({
  name: "userDirs.setup() respects XDG user dir env vars on Linux",
  ignore: getOS() !== "linux",
  fn() {
    setEnv("XDG_MUSIC_DIR", "/tmp/music");
    setEnv("XDG_DESKTOP_DIR", "/tmp/desktop");
    setEnv("XDG_DOCUMENTS_DIR", "/tmp/docs");
    setEnv("XDG_DOWNLOAD_DIR", "/tmp/dl");
    setEnv("XDG_PICTURES_DIR", "/tmp/pics");
    setEnv("XDG_PUBLICSHARE_DIR", "/tmp/public");
    setEnv("XDG_VIDEOS_DIR", "/tmp/vids");
    setEnv("XDG_TEMPLATES_DIR", "/tmp/templates");

    try {
      const dirs = userDirs.setup();
      assertEquals(dirs.musicDir, "/tmp/music");
      assertEquals(dirs.desktopDir, "/tmp/desktop");
      assertEquals(dirs.documentDir, "/tmp/docs");
      assertEquals(dirs.downloadDir, "/tmp/dl");
      assertEquals(dirs.pictureDir, "/tmp/pics");
      assertEquals(dirs.publicDir, "/tmp/public");
      assertEquals(dirs.videoDir, "/tmp/vids");
      assertEquals(dirs.templateDir, "/tmp/templates");
    } finally {
      deleteEnv("XDG_MUSIC_DIR");
      deleteEnv("XDG_DESKTOP_DIR");
      deleteEnv("XDG_DOCUMENTS_DIR");
      deleteEnv("XDG_DOWNLOAD_DIR");
      deleteEnv("XDG_PICTURES_DIR");
      deleteEnv("XDG_PUBLICSHARE_DIR");
      deleteEnv("XDG_VIDEOS_DIR");
      deleteEnv("XDG_TEMPLATES_DIR");
    }
  },
});

Deno.test({
  name: "userDirs.setup() fontDir uses XDG_DATA_HOME when set on Linux",
  ignore: getOS() !== "linux",
  fn() {
    setEnv("XDG_DATA_HOME", "/tmp/xdg-data");
    try {
      const dirs = userDirs.setup();
      assertEquals(dirs.fontDir, "/tmp/xdg-data/fonts");
    } finally {
      deleteEnv("XDG_DATA_HOME");
    }
  },
});
