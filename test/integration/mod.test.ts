import { Coffee } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const coffee = new Coffee();

coffee.defaultOptions.configPath = "./test/mockConfig";

Deno.test("Coffee integration -> should get config", () => {
  const b = coffee.get("a.b").number();
  assertEquals(b, 4);
});
