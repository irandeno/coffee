import { RuntimeAPI } from "./RuntimeAPI.abstract.ts";

export class DenoAPI extends RuntimeAPI {
  getEnvVars() {
    return Deno.env.toObject();
  }
  readFile(path: string) {
    return Deno.readTextFileSync(path);
  }
}
