import Validateable from "./src/Validateable.ts";
import lensProp from "./src/lensProp.ts";
import deepExtend from "./src/deepExtend.ts";
import deepObjectMap from "./src/deepObjectMap.ts";
import { ymlReader } from "./src/ymlReader.ts";
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
  directoryEntries: Deno.DirEntry[];
  getEnvVar(key: string): string | undefined;
  getRuntimeEnv(): string | undefined;
  readFileIfExist(path: string): string | undefined;
  scanDirForFile(filename: string, extentions: string[]): string | undefined;
  readDirEntries(dir: string, allowedExtentions: string[]): boolean;
}

class DenoAPI implements RuntimeAPI {
  envName = "DENO_ENV";
  directoryEntries: Deno.DirEntry[] = [];
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
    return Deno.env.get(this.envName);
  }

  scanDirForFile(filename: string, extentions: string[]): string | undefined {
    for (const extention of extentions) {
      for (const entry of this.directoryEntries) {
        if (entry.name === `${filename}.${extention}`) return entry.name;
      }
    }
  }

  readDirEntries(dir: string, allowedExtentions: string[]): boolean {
    try {
      while (this.directoryEntries.length > 0) this.directoryEntries.pop();
      for (const entry of Deno.readDirSync(dir)) {
        if (!entry.isFile) continue;
        const entryExt = entry.name.substring(entry.name.lastIndexOf(".") + 1);
        if (allowedExtentions.includes(entryExt)) {
          this.directoryEntries.push(entry);
        }
      }
      return this.directoryEntries.length > 0;
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
  private fileExts = ["json", "yml"]; // order is matters.

  runtimeAPI: RuntimeAPI = new DenoAPI();
  parsers: { [k: string]: Parser } = {
    json: (t: string) => JSON.parse(t),
    yml: (t: string) => ymlReader(t),
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

  private loadConfigs() {
    const configFileName = this.runtimeAPI.scanDirForFile(
      "default",
      this.fileExts,
    );
    if (typeof configFileName == "undefined") return;
    let configs = this.readConfigFile(configFileName);
    if (typeof configs == "undefined") return;
    deepExtend(this.configs, configs);
  }

  private loadEnvRelativeConfigs() {
    const runtimeENV = this.runtimeAPI.getRuntimeEnv();
    if (typeof runtimeENV == "undefined") return;
    const envRelatedFileName = this.runtimeAPI.scanDirForFile(
      runtimeENV,
      this.fileExts,
    );
    if (typeof envRelatedFileName == "undefined") return;
    const envConfigs = this.readConfigFile(envRelatedFileName);
    if (typeof envConfigs == "undefined") return;
    deepExtend(this.configs, envConfigs);
  }

  private loadCustomEnvVarConfigs() {
    const customEnvVarFileName = this.runtimeAPI.scanDirForFile(
      this.loadOptions.customEnvVarFileName,
      this.fileExts,
    );
    if (typeof customEnvVarFileName == "undefined") return;
    const customEnvVars = this.readConfigFile(customEnvVarFileName);
    if (typeof customEnvVars == "undefined") return;
    deepObjectMap((value) => {
      if (typeof value !== "string") return;
      return this.runtimeAPI.getEnvVar(value);
    }, customEnvVars);

    deepExtend(this.configs, customEnvVars);
  }

  load(opts: Partial<LoadOptions> = {}): void {
    this.loadOptions = deepExtend(defaultOptions, opts);
    const dirEntries = this.runtimeAPI.readDirEntries(
      this.loadOptions.configDir,
      this.fileExts,
    );

    if (!dirEntries) {
      throw new Error(
        `configDir: ${this.loadOptions.configDir} is not existed or has no config files!`,
      );
    }
    this.loadConfigs();
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
