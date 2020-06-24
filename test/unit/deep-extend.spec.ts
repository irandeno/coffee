import de from "../../src/deep-extend.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("should return a merged object", () => {
  const result = de({
    a: {
      b: 5,
      c: 6,
    },
    d: true,
    j: [],
    k: [1, 2],
  }, {
    a: {
      b: 10,
      e: "Hello",
    },
    f: "F",
    g: {
      h: "H",
    },
    j: "some",
    k: [5, 6],
    l: [1, 2],
    r: /s/,
    o: {},
  });

  assertEquals(result, {
    a: {
      b: 10,
      c: 6,
      e: "Hello",
    },
    d: true,
    f: "F",
    g: {
      h: "H",
    },
    j: "some",
    k: [5, 6],
    l: [1, 2],
    r: /s/,
    o: {},
  });
});

Deno.test("should consider skipIfExist option and not overwrite the existing properties", () => {
  const result = de({
    b: 5,
    c: 6,
  }, {
    b: 10,
    e: "Hello",
  }, { skipIfExist: true });

  assertEquals(result, {
    b: 5,
    c: 6,
    e: "Hello",
  });
});
