import Validateable from "./src/Validateable.ts";
import lensProp from "./src/lensProp.ts";
import deepExtend from "./src/deepExtend.ts";

export interface Configs {
  [key: string]: Configs | string | number | boolean;
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

const defaultOptions: Configs = {
  configPath: "./config",
};

export class Coffee {
  private loadOptions: LoadOptions = {};
  private isLoaded = false;

  runtimeAPI: RuntimeAPI = new DenoAPI();
  parsers: { [k: string]: Parser } = {
    json: (t: string) => JSON.parse(t),
  };
  configs: Configs = {};

  private readConfigFile(filePath: string): Configs | undefined {
    const rawConfigs = this.runtimeAPI.readFileIfExist(
      this.loadOptions.configPath + "/" + filePath,
    );

    if (!rawConfigs) return undefined;
    const fileExt = filePath.split(".").slice(-1)[0];
    if (this.parsers[fileExt]) return this.parsers[fileExt](rawConfigs);

    throw new Error(`"${fileExt}" file extension not supported!`);
  }

  load(opts: LoadOptions = {}): void {
    this.loadOptions = deepExtend(defaultOptions, opts);

    const defaultConfigs = this.readConfigFile("default.json");
    if (defaultConfigs) this.configs = defaultConfigs;

    const runtimeENV = this.runtimeAPI.getRuntimeEnv();
    if (runtimeENV) {
      const envConfigs = this.readConfigFile(`${runtimeENV}.json`);
      if (envConfigs) this.configs = deepExtend(this.configs, envConfigs);
    }

    this.isLoaded = true;
  }

  get(path: string): Validateable {
    if (this.isLoaded === false) this.load();
    const v = lensProp(this.configs, path);
    return new Validateable(v);
  }

  has(path: string): boolean {
    if (this.isLoaded === false) this.load();
    try {
      const v = lensProp(this.configs, path);
      return v !== undefined;
    } catch (e) {
      return false;
    }
  }

  set(path: string, value: string | number | boolean): void {
    if (this.isLoaded === false) this.load();
    lensProp(this.configs, path, value);
  }
}

export default new Coffee();
