type AnyObject = {
  [key in string | number]: any;
};

interface DeepExtendOptions {
  skipIfExist?: boolean;
}

function isObjectHasKeys(v: unknown): boolean {
  if (typeof v !== "object" || Array.isArray(v) || v == null) return false;
  return Object.keys(v).length > 0;
}

export default function deepExtend<T = AnyObject>(
  destination: AnyObject,
  source: AnyObject,
  options: DeepExtendOptions = {},
): T {
  for (let property in source) {
    if (isObjectHasKeys(source[property])) {
      destination[property] = destination[property] || {};
      deepExtend(destination[property], source[property], options);
    } else {
      if (
        options.skipIfExist === true && destination[property] !== undefined
      ) {
        continue;
      }

      if (source[property] === undefined) continue;
      destination[property] = source[property];
    }
  }
  return destination as T;
}
