export class BadConfigPath extends Error {
  constructor(path: string) {
    super();
    this.name = "BadConfigPath";
    this.message = `try to get an undefined path "${path}."`;
  }
}

export class BadConfigType extends Error {
  constructor(value: unknown, expected: string, path?: string) {
    super();
    this.name = "BadConfigType";
    let pathMessage = path && path.length > 0 ? `in path : "${path}"` : "";
    this.message = `"${value}" ${pathMessage} is not a ${expected}.`;
  }
}

export class NoConfigDir extends Error {
  constructor(dir: string) {
    super();
    this.name = "NoConfigDir";
    this.message = `"${dir}" directory is not exists.`;
  }
}

export class NoConfigFile extends Error {
  constructor(dir: string) {
    super();
    this.name = "NoConfigFile";
    this.message = `there is no config file in "${dir}" directory.`;
  }
}
