import Validateable from "./src/Validateable.ts";
import lensProp from "./src/lensProp.ts";

interface Configs {
  [key: string]: unknown;
}

interface Parser {
  (raw: string): Configs;
}

interface RuntimeAPI {
  getEnvVars(): Configs;
  readFile(path: string): string;
}

class DenoAPI implements RuntimeAPI {
  getEnvVars() {
    return Deno.env.toObject();
  }
  readFile(path: string) {
    return Deno.readTextFileSync(path);
  }
}

export class Coffee {
  defaultConfigPath = "./config";
  runtimeAPI: RuntimeAPI = new DenoAPI();
  private isLoaded = false;

  parsers: { [k: string]: Parser } = {
    JSON: (t: string) => JSON.parse(t),
  };

  configs: Configs = {};

  load(): void {
    const rawConfigs = this.runtimeAPI.readFile(this.defaultConfigPath + '/default.json');
    this.configs = this.parsers.JSON(rawConfigs);
    this.isLoaded = true;
  }

  get(path: string): Validateable {
    if (this.isLoaded === false) this.load();
    const v = lensProp(this.configs, path);
    return new Validateable(v);
  }
}

export default new Coffee();
