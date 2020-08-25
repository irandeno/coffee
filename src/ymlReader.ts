import { ymlParse as parse, JSON_SCHEMA } from "./deps.ts";
import { Configs } from "../mod.ts";

export const ymlReader = (t: string): Configs =>
  parse(t, {
    schema: JSON_SCHEMA,
    json: true,
  }) as Configs;
