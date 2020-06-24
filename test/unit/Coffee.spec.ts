import { Coffee, Configs } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";

const coffee = new Coffee();

// mocking runtimeAPI.readFileIfExist behavior
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

// mocking runtimeAPI.getRuntimeEnv behavior
coffee.runtimeAPI.getRuntimeEnv = function () {
  return undefined;
};

Deno.test("coffee.get", () => {
  const b: number = coffee.get("a.b").number();
  const t: string = coffee.get("a.t").string();
  const a: boolean = coffee.get("a.a").boolean();

  assertEquals(b, 3);
  assertEquals(t, "default");
  assertEquals(a, true);
});

Deno.test("coffee.has", () => {
  assertEquals(coffee.has("a.b"), true);
  assertEquals(coffee.has("a"), true);
  assertEquals(coffee.has("a.c"), false);
});

Deno.test("coffee.set -> it should create new config", () => {
  coffee.set("b.c", "newValue");
  assertEquals((coffee.configs.b as Configs).c, "newValue");
  assertEquals(coffee.get("b.c").string(), "newValue");
});

Deno.test("coffee.set -> it should override existing config", () => {
  coffee.set("b.c", "newValue2");
  assertEquals((coffee.configs.b as Configs).c, "newValue2");
  assertEquals(coffee.get("b.c").string(), "newValue2");
});

Deno.test("It should load [DENO_ENV].json file", () => {
  coffee.runtimeAPI.getRuntimeEnv = function () {
    return "development";
  };

  coffee.load();

  const b: number = coffee.get("a.b").number();
  const t: string = coffee.get("a.t").string();
  const a: boolean = coffee.get("a.a").boolean();

  assertEquals(b, 3);
  assertEquals(t, "dev");
  assertEquals(a, true);
});
