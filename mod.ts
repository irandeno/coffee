import Validateable from "./src/Validateable.ts";
import lensProp from "./src/lensProp.ts";
import deepExtend from "./src/deepExtend.ts";

interface Configs {
  [key: string]: unknown;
}

interface Parser {
  (raw: string): Configs;
}

type LoadOptions = {
  configPath?: string;
  env?: string;
};

interface RuntimeAPI {
  envName: string;
  getEnvVars(): Configs;
  getRuntimeEnv(): string | undefined;
  readFileIfExist(path: string): string | undefined;
}

class DenoAPI implements RuntimeAPI {
  envName = "DENO_ENV";
  getEnvVars() {
    return Deno.env.toObject();
  }
  readFileIfExist(path: string) {
    try {
      return Deno.readTextFileSync(path);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
  getRuntimeEnv() {
    return Deno.env.get("DENO_ENV");
  }
}

export class Coffee {
  defaultOptions: LoadOptions = {
    configPath: "./config",
  };

  runtimeAPI: RuntimeAPI = new DenoAPI();
  private isLoaded = false;

  parsers: { [k: string]: Parser } = {
    JSON: (t: string) => JSON.parse(t),
  };

  configs: Configs = {};

  load(opts: LoadOptions = {}): void {
    this.defaultOptions = deepExtend(this.defaultOptions, opts);

    const defaultConfigs = this.runtimeAPI.readFileIfExist(
      this.defaultOptions.configPath + "/default.json",
    );
    if (defaultConfigs) this.configs = this.parsers.JSON(defaultConfigs);

    const runtimeENV = this.runtimeAPI.getRuntimeEnv();
    if (runtimeENV) {
      const envConfigs = this.runtimeAPI.readFileIfExist(
        this.defaultOptions.configPath + `/${runtimeENV}.json`,
      );

      if (envConfigs) {
        this.configs = deepExtend(this.configs, this.parsers.JSON(envConfigs));
      }
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
