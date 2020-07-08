import coffee, { errors } from "https://deno.land/x/coffee/mod.ts";

// No Config Dir :

try {
  coffee.load({ configDir: "./bad-config-dir" });
} catch (e) {
  if (e instanceof errors.NoConfigDir) {
    // now IDE knows about "e" and can provide hints.
    e.message; // "./bad-config-dir" directory is not exists.
  }
}

// No Config File :

try {
  coffee.load({ configDir: "./bad" });
} catch (e) {
  if (e instanceof errors.NoConfigFile) {
    /* if coffee didn't see any valid config file with allowed extention,
     * it will throw a NoConfigFile error.
     */
    e.message; // there is no config file in "./bad" directory.
  }
}

// Bad Config Path :

try {
  coffee.load({ configDir: "./config" });
  coffee.get("database.entry").string();
} catch (e) {
  if (e instanceof errors.BadConfigPath) {
    e.message; // try to get an undefined path "database.entry".
  }
}

// Bad Config Type :

try {
  coffee.load({ configDir: "./config" });
  coffee.get("database.name").number();
} catch (e) {
  if (e instanceof errors.BadConfigType) {
    e.message; // "my-db-name" in path : "database.name" is not a number.
  }
}
