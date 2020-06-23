import { RuntimeAPI } from "./src/RuntimeAPI/RuntimeAPI.abstract.ts";
import { DenoAPI } from "./src/RuntimeAPI/Deno.ts";
import ValidateableValue from "./src/ValidateableValue.ts";
import lensProp from "./src/lensProp.ts";

interface Configs {
  [key: string]: unknown;
}

interface Parser {
  (raw: string): Configs;
}
export class Coffee {
  defaultConfigPath = "./config/default.json";
  runtimeAPI: RuntimeAPI = new DenoAPI();
  private isLoaded = false;

  parsers: { [k: string]: Parser } = {
    JSON: (t: string) => JSON.parse(t),
  };

  configs: Configs = {};

  load(): void {
    const rawConfigs = this.runtimeAPI.readFile(this.defaultConfigPath);
    this.configs = this.parsers.JSON(rawConfigs);
    this.isLoaded = true;
  }

  get(path: string): ValidateableValue {
    if (this.isLoaded === false) this.load();
    const v = lensProp(this.configs, path);
    return new ValidateableValue(v);
  }
}

export default new Coffee();
