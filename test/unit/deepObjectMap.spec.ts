import dom from "../../src/deepObjectMap.ts";
import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";

Deno.test("should deep-map a object", () => {
  const o = {
    a: {
      b: {},
      c: {
        d: 2,
        e: 3,
      },
      g: 4,
      h: [],
    },
  };

  dom((v) => {
    if (typeof v === "number") return v * 2;
  }, o);

  assertEquals(o.a.c.d, 4);
  assertEquals(o.a.c.e, 6);
  assertEquals(o.a.g, 8);
  assertEquals(o.a.b, undefined);
  assertEquals(o.a.h, undefined);
});
