import { BadConfigType } from "./errors.ts";

export default class Validateable {
  value: unknown;
  path: string | undefined;
  constructor(v: unknown, path?: string) {
    this.value = v;
    this.path = path;
  }

  number(): number {
    if (typeof this.value === "number") {
      if (isNaN(this.value)) {
        throw new BadConfigType(this.value, "number", this.path);
      }
      return this.value;
    }

    if (typeof this.value === "string" && this.value.length > 0) {
      let numericValue = Number(this.value);
      if (this.value as unknown == numericValue) {
        return numericValue;
      }
    }

    throw new BadConfigType(this.value, "number", this.path);
  }

  string(): string {
    if (typeof this.value !== "string" || this.value.length === 0) {
      throw new BadConfigType(this.value, "string", this.path);
    }
    return this.value;
  }

  boolean(): boolean {
    if (typeof this.value == "boolean") return this.value;

    // sanitization
    if (this.value === "true") return true;
    if (this.value === "false") return false;

    throw new BadConfigType(this.value, "boolean", this.path);
  }
}
