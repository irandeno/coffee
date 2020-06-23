import coffee from "../../mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

coffee.defaultConfigPath = './test/mockConfig'

Deno.test("Coffee Simple usage", () => {
  const b = coffee.get("a.b").number();
  assertEquals(b, 4);
});