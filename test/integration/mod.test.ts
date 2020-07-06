import { Coffee } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";

const coffee = new Coffee();

coffee.runtimeAPI.getRuntimeEnv = function () {
  return undefined;
};

Deno.test("Coffee integration -> should get config", () => {
  coffee.load({
    configDir: "./test/mockConfig/json",
  });
  const b = coffee.get("a.b").number();
  assertEquals(b, 1);
});

Deno.test("Coffee supports yml files -> return 2 and 3", () => {
  coffee.load({
    configDir: "./test/mockConfig/yml",
  });
  const b = coffee.get("a.b").number();
  assertEquals(b, 2);
  coffee.set("a.b", 3);
  const newB = coffee.get("a.b").number();
  assertEquals(newB, 3);
});
