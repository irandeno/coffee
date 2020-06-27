type AnyObject = {
  [key in string | number]: any;
};

interface CallbackFn {
  (value: unknown): unknown;
}

function isObjectHasKeys(v: unknown): boolean {
  if (typeof v !== "object" || Array.isArray(v) || v == null) return false;
  return Object.keys(v).length > 0;
}

export default function deepObjectMap(fn: CallbackFn, o: AnyObject): AnyObject {
  if (!isObjectHasKeys(o)) return o;
  for (const keyName in o) {
    if (isObjectHasKeys(o[keyName])) deepObjectMap(fn, o[keyName]);
    else o[keyName] = fn(o[keyName]);
  }

  return o;
}
