import lp from "../../src/lensProp.ts";
import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";

Deno.test("[lensProp] get correct value", () => {
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

Deno.test("[lensProp] set the existing value", () => {
  const o = {
    a: 1,
    b: {
      c: {
        d: "bar",
      },
    },
  };

  lp(o, "a", 2);
  lp(o, "b.c.d", "bar2");

  assertEquals(lp(o, "a"), 2);
  assertEquals(lp(o, "b.c.d"), "bar2");
});

Deno.test("[lensProp] create and set value is not exist", () => {
  const o = {};
  lp(o, "b.c.d", "bar2");
  assertEquals(lp(o, "b.c.d"), "bar2");
});
