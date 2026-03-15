import { assertEquals, assertMatch } from "jsr:@std/assert@^1.0.19";
import { userDirs } from "../mod.ts";

Deno.test("userDirs.setup() returns non-empty strings", () => {
  const dirs = userDirs.setup();
  for (const [key, value] of Object.entries(dirs)) {
    assertEquals(
      typeof value,
      "string",
      `${key} should be a string`,
    );
    assertEquals(value.length > 0, true, `${key} should be non-empty`);
  }
});

Deno.test("userDirs.setup() contains platform-specific segments", () => {
  const dirs = userDirs.setup();

  switch (Deno.build.os) {
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
  ignore: Deno.build.os !== "linux",
  fn() {
    Deno.env.set("XDG_MUSIC_DIR", "/tmp/music");
    Deno.env.set("XDG_DESKTOP_DIR", "/tmp/desktop");
    Deno.env.set("XDG_DOCUMENTS_DIR", "/tmp/docs");
    Deno.env.set("XDG_DOWNLOAD_DIR", "/tmp/dl");
    Deno.env.set("XDG_PICTURES_DIR", "/tmp/pics");
    Deno.env.set("XDG_PUBLICSHARE_DIR", "/tmp/public");
    Deno.env.set("XDG_VIDEOS_DIR", "/tmp/vids");
    Deno.env.set("XDG_TEMPLATES_DIR", "/tmp/templates");

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
      Deno.env.delete("XDG_MUSIC_DIR");
      Deno.env.delete("XDG_DESKTOP_DIR");
      Deno.env.delete("XDG_DOCUMENTS_DIR");
      Deno.env.delete("XDG_DOWNLOAD_DIR");
      Deno.env.delete("XDG_PICTURES_DIR");
      Deno.env.delete("XDG_PUBLICSHARE_DIR");
      Deno.env.delete("XDG_VIDEOS_DIR");
      Deno.env.delete("XDG_TEMPLATES_DIR");
    }
  },
});

Deno.test({
  name: "userDirs.setup() fontDir uses XDG_DATA_HOME when set on Linux",
  ignore: Deno.build.os !== "linux",
  fn() {
    Deno.env.set("XDG_DATA_HOME", "/tmp/xdg-data");
    try {
      const dirs = userDirs.setup();
      assertEquals(dirs.fontDir, "/tmp/xdg-data/fonts");
    } finally {
      Deno.env.delete("XDG_DATA_HOME");
    }
  },
});
