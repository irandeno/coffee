class Coffee {
  private config: object = {};
  private currentLocation: string = "";
  async load(filename?: string | URL) {
    let configContent;
    if (filename) {
      configContent = await Deno.readTextFile(filename);
    } else {
      configContent = await this.getDefaultConfig();
    }
    this.config = this.parse(configContent);
  }

  private async getDefaultConfig() {
    let defaultConfig = await Deno.readTextFile("./config/config.json");
    return defaultConfig;
  }

  private parse(configContent: string) {
    return JSON.parse(configContent);
  }

  get(location: string) {
    this.currentLocation = location;
    return this;
  }

  toNumber(): number {
    let configItem = this.getConfigItem();
    if (typeof configItem !== "number") {
      throw new Error(`${this.currentLocation} is not a number`);
    }
    return configItem;
  }

  toString(): string {
    let configItem = this.getConfigItem();
    if (typeof configItem !== "string") {
      throw new Error(`${this.currentLocation} is not a string`);
    }
    return configItem;
  }

  toBoolean(): boolean {
    let configItem = this.getConfigItem();
    if (typeof configItem !== "boolean") {
      throw new Error(`${this.currentLocation} is not a string`);
    }
    return configItem;
  }

  toAny(): any {
    return this.getConfigItem();
  }

  private getConfigItem() {
    return this.currentLocation.split(".").reduce((previuse: any, current) => {
      return previuse[current];
    }, this.config);
  }
}

export default new Coffee();
