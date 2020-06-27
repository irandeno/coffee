import de from "../../src/deepExtend.ts";
import { assertEquals } from "https://deno.land/std@0.58.0/testing/asserts.ts";

Deno.test("should return a merged object", () => {
  const result = de({
    a: {
      b: 5,
      c: 6,
    },
    d: true,
    j: [],
    k: [1, 2],
    n: "a",
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
    n: undefined,
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
    n: "a",
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
