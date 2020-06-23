class Coffe {
  private config: object = {};
  async load(filename?: string | URL) {
    let configContent;
    if (filename) {
      configContent = await Deno.readTextFile(filename);
    } else {
      configContent = await this.getDefaultConfig();
    }
    this.config = this.parse(configContent);
  }

  async getDefaultConfig() {
    let defaultConfig = await Deno.readTextFile("./config/config.json");
    return defaultConfig;
  }

  parse(configContent: string) {
    return JSON.parse(configContent);
  }

  get(location: string) {
    return location.split(".").reduce((previuse: any, current) => {
      return previuse[current];
    }, this.config);
  }
}

export default new Coffe();
