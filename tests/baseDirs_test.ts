import { assertEquals, assertMatch } from "jsr:@std/assert";
import { baseDirs } from "../mod.ts";

Deno.test("baseDirs.setup() returns non-empty strings", () => {
  const dirs = baseDirs.setup();
  for (const [key, value] of Object.entries(dirs)) {
    assertEquals(
      typeof value,
      "string",
      `${key} should be a string`,
    );
    assertEquals(value.length > 0, true, `${key} should be non-empty`);
  }
});

Deno.test("baseDirs.setup() contains platform-specific segments", () => {
  const dirs = baseDirs.setup();

  switch (Deno.build.os) {
    case "linux":
      assertMatch(dirs.cacheDir, /\.cache/);
      assertMatch(dirs.configDir, /\.config/);
      assertMatch(dirs.dataDir, /\.local\/share/);
      assertMatch(dirs.stateDir, /\.local\/state/);
      assertMatch(dirs.executableDir, /\.local\/bin/);
      break;

    case "darwin":
      assertMatch(dirs.cacheDir, /Library\/Caches/);
      assertMatch(dirs.configDir, /Library\/Application Support/);
      assertMatch(dirs.preferenceDir, /Library\/Preferences/);
      break;

    case "windows":
      assertMatch(dirs.cacheDir, /AppData\\Local/);
      assertMatch(dirs.configDir, /AppData\\Roaming/);
      assertMatch(dirs.dataLocalDir, /AppData\\Local/);
      break;
  }
});

Deno.test({
  name: "baseDirs.setup() respects XDG env vars on Linux",
  ignore: Deno.build.os !== "linux",
  fn() {
    Deno.env.set("XDG_CACHE_HOME", "/tmp/xdg-cache");
    Deno.env.set("XDG_CONFIG_HOME", "/tmp/xdg-config");
    Deno.env.set("XDG_DATA_HOME", "/tmp/xdg-data");
    Deno.env.set("XDG_STATE_HOME", "/tmp/xdg-state");
    Deno.env.set("XDG_RUNTIME_DIR", "/tmp/xdg-runtime");

    try {
      const dirs = baseDirs.setup();
      assertEquals(dirs.cacheDir, "/tmp/xdg-cache");
      assertEquals(dirs.configDir, "/tmp/xdg-config");
      assertEquals(dirs.dataDir, "/tmp/xdg-data");
      assertEquals(dirs.dataLocalDir, "/tmp/xdg-data");
      assertEquals(dirs.preferenceDir, "/tmp/xdg-config");
      assertEquals(dirs.stateDir, "/tmp/xdg-state");
      assertEquals(dirs.runtimeDir, "/tmp/xdg-runtime");
    } finally {
      Deno.env.delete("XDG_CACHE_HOME");
      Deno.env.delete("XDG_CONFIG_HOME");
      Deno.env.delete("XDG_DATA_HOME");
      Deno.env.delete("XDG_STATE_HOME");
      Deno.env.delete("XDG_RUNTIME_DIR");
    }
  },
});
