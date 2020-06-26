import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.58.0/testing/asserts.ts";
import Validateable from "../../src/Validateable.ts";

Deno.test("Validateable -> string", () => {
  assertEquals(new Validateable("8").string(), "8");
  assertThrows(() => new Validateable(8).string(), Error);
  assertThrows(() => new Validateable("").string(), Error);
});

Deno.test("Validateable -> number", () => {
  assertEquals(new Validateable("8").number(), 8);
  assertThrows(() => new Validateable("").number(), Error);
  assertThrows(() => new Validateable("12AB").number(), Error);
});

Deno.test("Validateable -> boolean", () => {
  assertEquals(new Validateable(true).boolean(), true);
  assertEquals(new Validateable(false).boolean(), false);
  assertEquals(new Validateable("true").boolean(), true);
  assertEquals(new Validateable("false").boolean(), false);

  assertThrows(() => new Validateable("").boolean(), Error);
  assertThrows(() => new Validateable(0).boolean(), Error);
});

