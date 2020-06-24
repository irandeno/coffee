import Validateable from "./src/Validateable.ts";
import lensProp from "./src/lensProp.ts";

interface Configs {
  [key: string]: unknown;
}

interface Parser {
  (raw: string): Configs;
}

type LoadOptions = {
  configPath?: string;
};

interface RuntimeAPI {
  getEnvVar(key: string): string | undefined;
  getEnvVars(): Configs;
  readFile(path: string): string;
}

class DenoAPI implements RuntimeAPI {
  getEnvVars() {
    return Deno.env.toObject();
  }
  getEnvVar(key: string) {
    return Deno.env.get(key);
  }
  readFile(path: string) {
    return Deno.readTextFileSync(path);
  }
}

export class Coffee {
  defaultOptions: LoadOptions = { configPath: "./config" };
  runtimeAPI: RuntimeAPI = new DenoAPI();
  private isLoaded = false;

  parsers: { [k: string]: Parser } = {
    JSON: (t: string) => JSON.parse(t),
  };

  configs: Configs = {};

  load(options: LoadOptions = this.defaultOptions): void {
    const rawConfigs = this.runtimeAPI.readFile(
      options.configPath + "/default.json",
    );
    this.configs = this.parsers.JSON(rawConfigs);
    const environment = this.runtimeAPI.getEnvVar("DENO_ENV");
    if (typeof environment !== "undefined") {
      const rawEnvConfig = this.runtimeAPI.readFile(
        options.configPath + `/${environment}.json`,
      );
      const envParsedConfig = this.parsers.JSON(rawEnvConfig);
      Object.assign(this.configs, envParsedConfig);
    }
    this.isLoaded = true;
  }

  get(path: string): Validateable {
    if (this.isLoaded === false) this.load();
    const v = lensProp(this.configs, path);
    return new Validateable(v);
  }
}

export default new Coffee();
