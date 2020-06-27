import Validateable from "./src/Validateable.ts";
import lensProp from "./src/lensProp.ts";
import deepExtend from "./src/deepExtend.ts";
import deepObjectMap from "./src/deepObjectMap.ts";

export interface Configs {
  [key: string]: Configs | string | number | boolean;
}

interface Parser {
  (raw: string): Configs;
}

type LoadOptions = {
  configDir: string;
  customEnvVarFileName: string;
  env?: string;
};

interface RuntimeAPI {
  envName: string;
  getEnvVar(key: string): string | undefined;
  getRuntimeEnv(): string | undefined;
  readFileIfExist(path: string): string | undefined;
  isDirExist(path: string): boolean;
}

class DenoAPI implements RuntimeAPI {
  envName = "DENO_ENV";
  getEnvVar(key: string) {
    return Deno.env.get(key);
  }
  readFileIfExist(path: string) {
    try {
      return Deno.readTextFileSync(path);
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) return;
      throw e;
    }
  }
  getRuntimeEnv() {
    return Deno.env.get("DENO_ENV");
  }

  isDirExist(path: string) {
    try {
      Deno.readDirSync(path);
      return true;
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) return false;
      throw e;
    }
  }
}

const defaultOptions: LoadOptions = {
  configDir: "./config",
  customEnvVarFileName: "custom-environment-variables",
};

export class Coffee {
  private loadOptions: LoadOptions = defaultOptions;
  private isLoaded = false;

  runtimeAPI: RuntimeAPI = new DenoAPI();
  parsers: { [k: string]: Parser } = {
    json: (t: string) => JSON.parse(t),
  };
  configs: Configs = {};

  private readConfigFile(fileName: string): Configs | undefined {
    const rawConfigs = this.runtimeAPI.readFileIfExist(
      this.loadOptions.configDir + "/" + fileName,
    );

    if (!rawConfigs) return undefined;
    const fileExt = fileName.split(".").slice(-1)[0];
    if (this.parsers[fileExt]) return this.parsers[fileExt](rawConfigs);

    throw new Error(`"${fileExt}" file extension not supported!`);
  }

  private loadDefaultConfigs() {
    const defaultConfigs = this.readConfigFile("default.json");
    if (defaultConfigs) deepExtend(this.configs, defaultConfigs);
  }

  private loadEnvRelativeConfigs() {
    const runtimeENV = this.runtimeAPI.getRuntimeEnv();
    if (runtimeENV) {
      const envConfigs = this.readConfigFile(`${runtimeENV}.json`);
      if (envConfigs) deepExtend(this.configs, envConfigs);
    }
  }

  private loadCustomEnvVarConfigs() {
    const customEnvVars = this.readConfigFile(
      `${this.loadOptions.customEnvVarFileName}.json`,
    );

    if (customEnvVars) {
      deepObjectMap((value) => {
        if (typeof value !== "string") return;
        return this.runtimeAPI.getEnvVar(value);
      }, customEnvVars);

      deepExtend(this.configs, customEnvVars);
    }
  }

  load(opts: Partial<LoadOptions> = {}): void {
    this.loadOptions = deepExtend(defaultOptions, opts);
    const result = this.runtimeAPI.isDirExist(this.loadOptions.configDir)
    if (!result) throw new Error(`configDir: ${this.loadOptions.configDir} is not existed!`)
    
    this.loadDefaultConfigs();
    this.loadEnvRelativeConfigs();
    this.loadCustomEnvVarConfigs();

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
