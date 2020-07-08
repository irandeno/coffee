import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.58.0/testing/asserts.ts";
import Validateable from "../../src/Validateable.ts";
import { BadConfigType } from "../../src/errors.ts";

Deno.test("[Validateable] get string type value", () => {
  assertEquals(new Validateable("8").string(), "8");
  assertThrows(() => new Validateable(8).string(), BadConfigType);
  assertThrows(() => new Validateable("").string(), BadConfigType);
});

Deno.test("[Validateable] get number type value", () => {
  assertEquals(new Validateable("8").number(), 8);
  assertEquals(new Validateable("8.5").number(), 8.5);
  assertEquals(new Validateable("-8").number(), -8);
  assertEquals(new Validateable("+8").number(), 8);
  assertThrows(() => new Validateable("").number(), BadConfigType);
  assertThrows(() => new Validateable("12AB").number(), BadConfigType);
});

Deno.test("[Validateable] get boolean type value", () => {
  assertEquals(new Validateable(true).boolean(), true);
  assertEquals(new Validateable(false).boolean(), false);
  assertEquals(new Validateable("true").boolean(), true);
  assertEquals(new Validateable("false").boolean(), false);

  assertThrows(() => new Validateable("").boolean(), BadConfigType);
  assertThrows(() => new Validateable(0).boolean(), BadConfigType);
});
