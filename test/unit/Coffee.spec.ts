import coffee from "../../Coffee.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

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
