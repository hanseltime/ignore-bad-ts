# ignore-bad-ts

This project provides various CLI and programmatic APIs to avoid type-checking failures in external libraries that you have no control over. 
 This is meant to enable you to keep stricter type safety in your project without being unable to use typescript as your main compiler. 

## Installation

```bash
    yarn add --dev ignore-bad-ts
```

## How this could happen:

Perhaps you've found yourself in this situation.  You love typescript and all the security and scalability that it provides.

However, you're in an organization that is only now learning to love typescript like you.  And they're learning at a code-fast, type-later pace.

They ask you to do this:

```typescript
import CompanyModule from 'my-company-module';

// All your awesome typed code here
```

And when you run it, your seeing errors from... your node_modules!

```
node_modules/my-company-module/src/it-has-ts-at-least.ts - error TS7053 Element implicitly has an 'any' type...
```

Admittedly, the above error isn't THAT critical of a rule, but you still can't compile without changing your tscongif.  So what happened?

Well...

* maybe your co-workers decided to turn off particular best-practice settings and/or only provide their code as untranspiled es6.
* maybe your co-workers liked the idea of typescript in IDE for intellisense but have been transpiling with babel instead
* maybe there is literally no declaration files or broken declaration files due to bad CI/CD

So what do you do?

You could just disable all typescript compilation and use something like babel to transpile without the typechecking.

Hark, my friend!  Do no let your code quality and type-checking slide so that your own codebase can be broken later on too!

Instead you have ignore-bad-ts!

# What does it do?

In short, the scripts in this package will add "@ts-nocheck" at the top of all .ts(x) files that match the globs you provide.  This solution
may become deprecated if per module type checking is added to the typescript compiler itself.

# Usage

## CLI

Once installed, you have the option of running a CLI tool

```
ignore-bad-ts node_modules/my-company-module/**
```

In the above example, we are telling ignore-bad-ts to inject ts-ignore tags on all current files in the directory that match the glob "node_modules/my-company-module/**".

## Programmatic API

This package also provides programmatic methods for marked files as ignored programmatically.

## ignoreFiles

This method is an async version that will find and modify all matching files.

## ignoreFilesSync

This method will find and modify all matching files synchronously.  This is not recommended, but is provided for
when you are restricted to synchronous execution (like nextjs configs).

### Arguments

Both functions generally match the argument signature of [fast-glob](https://www.npmjs.com/package/fast-glob?activeTab=readme).

There are a few differences:

1. Output variables are not allowed from fast-glob (This would affect how the glob output is processed)
2. debugGlob - Use this to log all files that matched the globs. (Helpful for verifying your glob is doing what you think)
3. debugTS - Use this to log all files that matched for writing @ts-nocheck.  (Helpful for verifying only the ts files that should be written to)

# Recipes/Examples

## NextJS config

If using NextJS, the strategy would be to synchronously call the ignore on your designated modules as your config file is instantiated.

```javascript
// next.config.js
const { ignoreFilesSync } = require('ignore-bad-ts');

// Apply the ignore as we initialize this module, so nextJS can compile, etc.
ignoreFilesSync(['node_modules/my-company-module/**']);


module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return config
  },
}
```

## yarn command pre-command

You may want to simply add the cli command in scripts to ensure they build correctly.

Keep in mind, that you would need to apply this at every command that uses typechecking, since any
new developer may run one command out of order with the other, and fail to get a compilation.

In the below example, we assume that jest is using ts-jest, and so we also want to ignore-bad-ts when calling it.

```json
// package.json
{
    ...,
    "scripts": {
        "build": "ignore-bad-ts node/modules/my-company-module/** && tsc",
        "test": "ignore-bad-ts node/modules/my-company-module/** && jest"
    },
    ...
}
```

## Development Notes

If you would like to test a feature or changes to this package, I highly recommend setting up a local verdaccio instance.

TBD: I will link a bare bones local verdaccio registry for running on your local machine.  This allows you to separately import your package. :D
