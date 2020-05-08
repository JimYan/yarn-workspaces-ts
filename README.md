# yarn workspace project template

![Node.js CI](https://github.com/JimYan/yarn-workspaces-ts/workflows/Node.js%20CI/badge.svg)

## Tools

- yarn: NPM client.
- Lerna: Multiple packages management tool.
- TypeScript: `^3.0.0` supports project references.
- Jest: ^23.6.0
- prettier
- tslint
- rollup
- typedoc

## Directory Structure

Put each package under the `packages` directory.

```
.
├── LICENSE.txt
├── README.md
├── lerna.json
├── package.json
├── packages
│   ├── tsconfig.json
│   ├── tsconfig.settings.json
│   ├── x-a
│   │   ├── CONTRIBUTING.md
│   │   ├── LICENSE
│   │   ├── README.md
│   │   ├── code-of-conduct.md
│   │   ├── package.json
│   │   ├── rollup.config.ts
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── test
│   │   │   └── library.test.ts
│   │   ├── tsconfig.json
│   │   └── tslint.json
│   └── x-b
│       ├── CONTRIBUTING.md
│       ├── LICENSE
│       ├── README.md
│       ├── code-of-conduct.md
│       ├── package.json
│       ├── rollup.config.ts
│       ├── src
│       │   └── index.ts
│       ├── test
│       │   └── b.test.ts
│       ├── tsconfig.json
│       └── tslint.json
└── yarn.lock
```

## Workspaces

Using [yarn workspace feature](https://yarnpkg.com/en/docs/workspaces), configure the following files:

- /package.json

Append the `workspaces` key.

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

- lerna.json

Set `npmClient` `"yarn"` and turn `useWorkspaces` on.

```json
{
  "lerna": "2.2.0",
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "useWorkspaces": true,
  "version": "1.0.0"
}
```

Exec `yarn install`(or `lerna bootstrap`). After successful running, all dependency packages are downloaded under the repository root `node_modules` directory.

### Dependencies between packages

In this example, the `x-cli` package depends on another package, `x-core`. So to execute (or test) `x-cli`, `x-core` packages should be installed.
But in development the `x-core` package is not published so you can't install it.

`yarn` solves this problem. This command creates sim-links of each package into the top-level `node_modules` dir.

## Resolve Dependencies as TypeScript Modules

As mentioned above, Lerna resolves dependencies between packages. It's enough for "runtime". However considering TypeScript sources, in other words "static", it's not.

For example, the following code depends a module `x-core` located at other package.

```ts
/* packages/x-a/src/index.ts */
import { awesomeFn } from "@quramy/x-b";

export function cli() {
  awesomeFn();
  return Promise.resolve(true);
}
```

If you compile this code, TypeScript compiler emits a "Cannot find module" error until building `x-core` package and creating `x-core/index.d.ts`. And it's silly to compile dependent packages(e.g. `x-core`) in the same repository after each editing them.

[TypeScript's path mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) is the best solution. Path mappings are declared such as:

```js
/* tsconfig.json */
{
  "compilerOptions": {
    /* other options */
    "baseUrl": "./packages",
    "paths": {
      "@quramy/*": ["./*/src"]
    }
  }
}
```

The above setting means `import { awesomeFn } from "@quramy/x-core"` is mapped to `import { awesomeFn } from "../../x-core/src"`(it's relative from "packages/x-cli/src/main.ts"). In other words, path mapping allows to treat developing packages' sources as published(compiled) modules.

### References between packages

TypeScript 3.0 supports [Project reference](https://www.typescriptlang.org/docs/handbook/project-references.html) feature. You can tell tsc that `x-cli` depends on `x-core` project using this.

```js
/* packages/x-cli/tsconfig.json */
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  },
  "references": [
    { "path": "../x-core" }
  ]
}
```

In the above json, the key `references` means the dependency.

### Compile all packages

start:

```sh
$ yarn
$ yarn start
```

build:

```sh
$ yarn
$ yarn build
```

test:

```sh
$ yarn
$ yarn test
```

## License

The MIT License (MIT)

Copyright 2017 Quramy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
