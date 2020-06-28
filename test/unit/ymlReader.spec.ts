import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";
import { ymlReader } from "../../src/ymlReader.ts";

Deno.test("ymlReader test -> return 4", () => {
  const parsedYml = ymlReader(`---
    a:
      b: 4
    `);
  const b = parsedYml.a.b;
  assertEquals(b, 4);
});
