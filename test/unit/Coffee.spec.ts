import { Coffee } from "../../mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const coffee = new Coffee();

const mockConfigs = {
  a: {
    b: 3,
  },
};

// mocking runtimeAPI.readFile behavior
coffee.runtimeAPI.readFile = function (): string {
  return JSON.stringify(mockConfigs);
};

Deno.test("Coffee Simple usage", () => {
  const b = coffee.get("a.b").number();
  assertEquals(b, 3);
});
