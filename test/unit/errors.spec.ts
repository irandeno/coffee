import coffee from "../../mod.ts";
import {
  assertThrows,
} from "https://deno.land/std@0.58.0/testing/asserts.ts";
import * as errors from "../../src/errors.ts";

Deno.test("[errors] no config directory", function () {
  assertThrows(
    () => coffee.load({ configDir: "./non-exists-dir" }),
    errors.NoConfigDir,
  );
});

Deno.test("[errors] no config file", function () {
  assertThrows(
    () => coffee.load({ configDir: "./test/mockConfig/empty" }),
    errors.NoConfigFile,
  );
});

Deno.test("[errors] bad config file extention", function () {
  assertThrows(
    () => coffee.load({ configDir: "./test/mockConfig/bad" }),
    errors.NoConfigFile,
  );
});

Deno.test("[errors] get bad config path", function () {
  coffee.runtimeAPI.getRuntimeEnv = () => "development";
  coffee.load({ configDir: "./test/mockConfig/json" });
  assertThrows(() => coffee.get("a.c"), errors.BadConfigPath);
});

Deno.test("[errors] get bad config type", function () {
  coffee.runtimeAPI.getRuntimeEnv = () => "development";
  coffee.load({ configDir: "./test/mockConfig/json" });
  assertThrows(() => coffee.get("a.b").boolean(), errors.BadConfigType);
  assertThrows(() => coffee.get("a.b").string(), errors.BadConfigType);
});
