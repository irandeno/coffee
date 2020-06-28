import { parse, JSON_SCHEMA } from "https://deno.land/std/encoding/yaml.ts";
import { Configs } from "../mod.ts";

export const ymlReader = (t: string): Configs =>
  parse(t, {
    schema: JSON_SCHEMA,
    json: true,
  }) as Configs;
