import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import ValidateableValue from "../../src/ValidateableValue.ts";

Deno.test("ValidateableValue -> string", () => {
  assertEquals(new ValidateableValue("8").string(), "8");
  assertThrows(() => new ValidateableValue(8).string(), Error);
});
