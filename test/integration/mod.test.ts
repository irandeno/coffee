import { Coffee } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const coffee = new Coffee();

coffee.runtimeAPI.getRuntimeEnv = function () {
  return undefined;
};

coffee.load({
  configDir: "./test/mockConfig",
});

Deno.test("Coffee integration -> should get config", () => {
  const b = coffee.get("a.b").number();
  assertEquals(b, 4);
});
