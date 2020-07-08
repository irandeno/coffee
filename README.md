
<div align="center">
<img width="100%" alt="picker" src="https://i.ibb.co/xHw5pkq/coffee.png">
<i>Type-safe, Easy To Use, <b>Deno Configuration</b>
</i>
</div>

## Getting Started
Getting started with coffee is as easy as writing two lines of code ...

```ts
// coffee.ts
import coffee from "https://deno.land/x/coffee/mod.ts";
const dbName: string = coffee.get("database.name").string();
```
```json
- coffee.ts
- config
  - default.json

// default.json
{
  "database": {
    "name": "my-db-name",
  }
}
```
and run 
```shell
deno run --allow-read --allow-env coffee.ts
```

## Type Safety
coffee's goal is to have the most safe types, so you can get the configurations in the desired types.
```ts
const name: string = coffee.get("person.name").string();
const age: number = coffee.get("person.age").number();
const passed: boolean = coffee.get("person.test.passed").boolean();
```
_**NOTE**_

coffee saves raw, unknown type values in `value` property of result of `get` method.
```ts
const magical: unknown = coffee.get("person.superpower").value;
```

## Has & Set
check configuration is available on config files with `has` method and set new configuration during runtume with `set`.
```ts
coffee.has("requests.limit"); // false
coffee.set("requests.limit" , 100);
coffee.has("requests.limit"); // true
```

## Custom Environment Variables
If you want to use environment variables, just create a file called `custom-environment-variable` and give it values that you want to read from environment variables.
```json
ENV_NAME=coffee

- coffee.ts
- config
  - custom-environment-variables.json

  // custom-environment-variables.json 
  {
   "name" : "ENV_NAME"
  }
```
```ts
// coffee.ts
import coffee from "https://deno.land/x/coffee/mod.ts";
const name: string = coffee.get("database.name").string(); // coffee, reads from ENV_NAME environment variable
```

## Related Environment Variables
coffee can read related environment variables from desired environment specified in `DENO_ENV` env.
```json
DENO_ENV=production

- coffee.ts
- config
  - production.json

  // production.json
  {
   "something" : "amazing"
  }
```
```ts
// coffee.ts
import coffee from "https://deno.land/x/coffee/mod.ts";
const name: string = coffee.get("something").string();
```

## Customize Coffee Load
coffee can read the configurations from the desired directory.
```
- coffee.ts
- custom
  - default.json
  - cev.json
  - production.json
```
```ts
// coffee.ts
import coffee from "https://deno.land/x/coffee/mod.ts";
coffee.load({ 
   configDir: "./custom", // specify the custom config directory
   customEnvVarFileName: "cev", // specify the desired custom environment variable config file name
   env: "production" // force relative environment variables to loads from this env
},);
const dbName: string = coffee.get("database.name").string();
```

## Error Handling
coffee tries to make a specific Error for each situation.
```ts
import coffee, { errors } from "../mod.ts";

try {
  coffee.load({ configDir: "./bad-config-dir" });
} catch (e) {
  if (e instanceof errors.NoConfigDir) {
    // now IDE knows about "e" and can provide hints.
    e.message; // "./bad-config-dir" directory is not exists.
  }
}
```

there are 4 kinds of Error Classes that exported from coffee module:

`NoConfigDir` : throwed when no config dir available.

`NoConfigFile` : throwed when there is no valid config file in config directory.

`BadConfigPath` : throwed when tries to get an undefined path from configs.

`BadConfigType` : throwed when tries to get an config with wrong type.

## Supported Formats
We currently support these formats : 
### json
```json
{
  "database":{
    "name" : "my-db-name"
  }
}
```
### yml
```yml
database:
  name: my-db-name
```

## Examples
A number of examples are included in [examples](./examples/) folder.

## Contributing
We are very pleased with your cooperation, so feel free to open issues and pull requests.
