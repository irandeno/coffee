import lp from "../../src/lensProp.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Simple usage", () => {
  const o = {
    a: 1,
    b: {
      c: {
        d: "bar",
      },
    },
  };

  assertEquals(lp(o, "a"), 1);
  assertEquals(lp(o, "b.c.d"), "bar");
});
