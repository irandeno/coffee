interface EnvVars {
  [key: string]: string;
}

export abstract class RuntimeAPI {
  abstract getEnvVars(): EnvVars;
  abstract readFile(path: string): string;
}
