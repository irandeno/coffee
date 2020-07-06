import { BadConfigPath } from "./errors.ts";

interface ConfigObject {
  [key: string]: unknown;
}

export default function (
  object: ConfigObject,
  path: string,
  set?: unknown,
): unknown {
  const splitedPath = path.split(".");
  const length = splitedPath.length;
  return splitedPath.reduce((previous: any, current, index) => {
    if (set === undefined) {
      if (previous[current] === undefined) {
        throw new BadConfigPath(path);
      }
    } else {
      if (index === length - 1) previous[current] = set;
      else if (previous[current] === undefined) previous[current] = {};
    }

    return previous[current];
  }, object);
}
