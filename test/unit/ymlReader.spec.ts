import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";
import { ymlReader } from "../../src/ymlReader.ts";

Deno.test("[ymlReader] yml reader/parser", () => {
  const parsedYml = ymlReader(`---
      b: 4
    `);
  const b = parsedYml.b;
  assertEquals(b, 4);
});
