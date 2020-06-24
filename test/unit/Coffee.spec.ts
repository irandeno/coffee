import { Coffee } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";

const coffee = new Coffee();

const mockConfigs = {
  a: {
    b: 3,
  },
};

// mocking runtimeAPI.readFile behavior
coffee.runtimeAPI.readFileIfExist = function (): string {
  return JSON.stringify(mockConfigs);
};

coffee.runtimeAPI.getRuntimeEnv = function () {
  return undefined;
};

Deno.test("coffee.get", () => {
  const b = coffee.get("a.b").number();
  assertEquals(b, 3);
});

Deno.test("coffee.has", () => {
  assertEquals(coffee.has("a.b"), true);
  assertEquals(coffee.has("a"), true);
  assertEquals(coffee.has("a.c"), false);
});
