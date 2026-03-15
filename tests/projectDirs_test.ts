import { assertMatch } from "jsr:@std/assert@^1.0.19";
import { projectDirs } from "../mod.ts";

const QUALIFIER = "com";
const ORG = "example";
const APP = "MyApp";

Deno.test("projectDirs.setup() includes application in all paths", () => {
  const dirs = projectDirs.setup(QUALIFIER, ORG, APP);
  for (const [key, value] of Object.entries(dirs)) {
    assertMatch(
      value,
      new RegExp(APP),
      `${key} should contain the application name`,
    );
  }
});

Deno.test("projectDirs.setup() uses correct format per platform", () => {
  const dirs = projectDirs.setup(QUALIFIER, ORG, APP);

  switch (Deno.build.os) {
    case "linux":
      // Linux: only application segment
      assertMatch(dirs.cacheDir, /\.cache\/MyApp$/);
      assertMatch(dirs.configDir, /\.config\/MyApp$/);
      assertMatch(dirs.dataDir, /\.local\/share\/MyApp$/);
      break;

    case "darwin":
      // macOS: reverse-DNS qualifier.org.app
      assertMatch(dirs.cacheDir, /com\.example\.MyApp$/);
      assertMatch(dirs.configDir, /com\.example\.MyApp$/);
      assertMatch(dirs.preferenceDir, /com\.example\.MyApp$/);
      break;

    case "windows":
      // Windows: org\app
      assertMatch(dirs.cacheDir, /example\\MyApp$/);
      assertMatch(dirs.configDir, /example\\MyApp$/);
      assertMatch(dirs.dataLocalDir, /example\\MyApp$/);
      break;
  }
});
