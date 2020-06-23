import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import Validateable from "../../src/Validateable.ts";

Deno.test("Validateable -> string", () => {
  assertEquals(new Validateable("8").string(), "8");
  assertThrows(() => new Validateable(8).string(), Error);
});
