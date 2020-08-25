import { Coffee, Configs } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std@0.60.0/testing/asserts.ts";

const coffee = new Coffee();

coffee.runtimeAPI.getEnvVar = () => undefined;
coffee.runtimeAPI.readFileIfExist = () => undefined;
coffee.runtimeAPI.getRuntimeEnv = () => undefined;

Deno.test("[api] read default.json file configs", () => {
  coffee.runtimeAPI.readFileIfExist = function (path) {
    if (path.includes("default.json")) {
      return JSON.stringify({
        a: {
          a: true,
          b: 3,
          t: "default",
        },
      });
    }
    return undefined;
  };

  coffee.load({ configDir: "./test/mockConfig/json" });

  const b: number = coffee.get("a.b").number();
  const t: string = coffee.get("a.t").string();
  const a: boolean = coffee.get("a.a").boolean();

  assertEquals(b, 3);
  assertEquals(t, "default");
  assertEquals(a, true);
});

Deno.test("[api] coffee.has", () => {
  assertEquals(coffee.has("a.b"), true);
  assertEquals(coffee.has("a"), true);
  assertEquals(coffee.has("a.c"), false);
});

Deno.test("[api] coffee.set - create new config", () => {
  coffee.set("b.c", "newValue");
  assertEquals((coffee.configs.b as Configs).c, "newValue");
  assertEquals(coffee.get("b.c").string(), "newValue");
});

Deno.test("[api] coffee.set - override existing config", () => {
  coffee.set("b.c", "newValue2");
  assertEquals((coffee.configs.b as Configs).c, "newValue2");
  assertEquals(coffee.get("b.c").string(), "newValue2");
});

Deno.test("[api] load [DENO_ENV].json file configs", () => {
  coffee.runtimeAPI.getRuntimeEnv = () => "development";

  coffee.runtimeAPI.readDirEntries = () => true;

  coffee.runtimeAPI.directoryEntries = [
    {
      name: "development.json",
      isFile: true,
      isDirectory: false,
      isSymlink: false,
    },
  ];

  coffee.runtimeAPI.readFileIfExist = function (path) {
    if (path.includes("default.json")) {
      return JSON.stringify({
        a: {
          a: true,
          b: 3,
          t: "default",
        },
      });
    }

    if (path.includes("development.json")) {
      return JSON.stringify({
        a: {
          t: "dev",
        },
      });
    }

    return undefined;
  };

  coffee.load();

  const b: number = coffee.get("a.b").number();
  const t: string = coffee.get("a.t").string();
  const a: boolean = coffee.get("a.a").boolean();

  assertEquals(b, 3);
  assertEquals(t, "dev");
  assertEquals(a, true);
});

Deno.test("[api] coffee.has", () => {
  assertEquals(coffee.has("a.b"), true);
  assertEquals(coffee.has("a"), true);
  assertEquals(coffee.has("a.c"), false);
});

Deno.test("[api] load custom-environment-variable file configs", () => {
  coffee.runtimeAPI.getRuntimeEnv = () => "development";

  coffee.runtimeAPI.readDirEntries = () => true;

  coffee.runtimeAPI.directoryEntries = [
    {
      name: "custom-environment-variables.json",
      isFile: true,
      isDirectory: false,
      isSymlink: false,
    },
  ];

  coffee.runtimeAPI.readFileIfExist = function (path) {
    if (path.includes("custom-environment-variables.json")) {
      return JSON.stringify({
        a: {
          port: "PORT",
          secret: "SECRET",
        },
      });
    }

    return undefined;
  };

  coffee.runtimeAPI.getEnvVar = function (key: string) {
    if (key === "PORT") return "3000";
    if (key === "SECRET") return "ABC";
    return;
  };

  coffee.load();

  const port: string = coffee.get("a.port").string();
  const secret: string = coffee.get("a.secret").string();

  assertEquals(port, "3000");
  assertEquals(secret, "ABC");
});
