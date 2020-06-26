export default class Validateable {
  value: unknown;
  constructor(v: unknown) {
    this.value = v;
  }

  number(): number {
    if (typeof this.value === "number") {
      if (isNaN(this.value)) throw new Error(`${this.value} is NaN`);
      return this.value;
    }

    if (typeof this.value === "string" && this.value.length > 0) {
      console.log("here");
      if (this.value.match(/^-{0,1}\d+$/)) {
        this.value = parseInt(this.value);
        return this.number();
      }
    }

    throw new Error(`${this.value} is not a number`);
  }

  string(): string {
    if (typeof this.value !== "string") {
      throw new Error(`${this.value} is not a string`);
    }
    if (this.value.length === 0) throw new Error("Value is empty string");
    return this.value;
  }

  boolean(): boolean {
    if (typeof this.value == "boolean") return this.value;

    // sanitization
    if (this.value === "true") return true;
    if (this.value === "false") return false;

    throw new Error(`${this.value} is not a boolean`);
  }
}
