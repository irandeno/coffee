export default class ValidateableValue {
  value: unknown;
  constructor(v: unknown) {
    this.value = v;
  }

  number(): number {
    if (typeof this.value !== "number") {
      throw new Error(`${this.value} is not a number`);
    }
    if (isNaN(this.value)) throw new Error(`${this.value} is NaN`);

    return this.value;
  }

  string(): string {
    if (typeof this.value !== "string") {
      throw new Error(`${this.value} is not a string`);
    }
    return this.value;
  }

  boolean(): boolean {
    if (typeof this.value !== "boolean") {
      throw new Error(`${this.value} is not a string`);
    }
    return this.value;
  }
}
