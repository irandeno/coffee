interface ConfigObject {
  [key: string]: unknown;
}

export default function (object: ConfigObject, path: string): unknown {
  return path.split(".").reduce((previous: any, current) => {
    if (previous[current] === undefined) {
      throw new Error(`Bad config path: ${path}`);
    }
    return previous[current];
  }, object);
}
