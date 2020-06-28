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
coffee.load({
  configDir: "./../mockConfig",
  configFile: "default2", // yml file
});
Deno.test("Coffee supports yml files -> return 4 and 5", () => {
  const b = coffee.get("a.b").number();
  assertEquals(b, 4);
  coffee.set("a.b", 5);
  const newB = coffee.get("a.b").number();
  assertEquals(b, 5);
});
