import coffee from "https://deno.land/x/coffee/mod.ts";

// if coffee.load() is not called, coffee automatically loads the configs from the './config' folder

let myDbName: string = coffee.get("database.user").string(); // my-db-name , loaded from default.json
coffee.has("database.host"); // false
coffee.set("database.host", "localhost"); // set new config
coffee.has("database.host"); // true

/* if default configs and custom-environment-variables have conflicts,
 * and if target custom-environment-variable is available,
 * default configs will be overwritten by target custom-environment-variable.
 */
let dbUser: string = coffee.get("database.user").string(); // DB_USER environment variable
let dbPassword: number = coffee.get("database.password").number(); // DB_PASSWORD environment variable

/* coffee can be reloaded config directory everywhere in the process,
 * all new configs will be replaced.
 */
coffee.load({
  configDir: "./custom",
  customEnvVarFileName: "cev",
  env: "production", // by default coffee read environment from `DENO_ENV` environment variable,
  // this option is to force coffee to read from this env and ignore `DENO_ENV`.
});

let newDbName: string = coffee.get("database.name").string(); // my-new-db-name, loaded from default.yml config file
let newDbPassword: number = coffee.get("database.password").number(); // NEW_DB_PASSWORD, environment variable, loaded from cev.yml
let dbLimitation: number = coffee.get("database.limitaion").number(); // 10, loaded from production.json
