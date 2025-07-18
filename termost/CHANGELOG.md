# termost

## 1.8.0

### Minor Changes

- [`537e186`](https://github.com/adbayb/termost/commit/537e18678277e2ac488eaac0b35906bdc53fd525) Thanks [@adbayb](https://github.com/adbayb)! - Preserve error label in case of error.

## 1.7.0

### Minor Changes

- [`26bd5ea`](https://github.com/adbayb/termost/commit/26bd5ea4e1c9e72c22ebd71bf5eb6d9b775cf072) Thanks [@adbayb](https://github.com/adbayb)! - Improve `input` interface to allow autocompletion and limit the number of options to 10 by default.

## 1.6.0

### Minor Changes

- [`ec977d8`](https://github.com/adbayb/termost/commit/ec977d83eb6ce3067a7fb4de1714057934d0ba71) Thanks [@adbayb](https://github.com/adbayb)! - Support readonly `options` for `input` interface.

## 1.5.0

### Minor Changes

- [`78bcfa9`](https://github.com/adbayb/termost/commit/78bcfa9577b98520d02e405fe0945388fad25266) Thanks [@adbayb](https://github.com/adbayb)! - Update listr2 to v9.0.1.

- [`7897f04`](https://github.com/adbayb/termost/commit/7897f047399146fe21bb3591f3bab551ccc00a96) Thanks [@adbayb](https://github.com/adbayb)! - Add validation support for `option`, `input`, and `task` interfaces.

## 1.4.0

### Minor Changes

- [`a14c632`](https://github.com/adbayb/termost/commit/a14c6329bf0108365f28fbc29c598353574f47e7) Thanks [@adbayb](https://github.com/adbayb)! - Remove default line breaks for message helper.

## 1.3.0

### Minor Changes

- [`838b409`](https://github.com/adbayb/termost/commit/838b409603e86968027f0175c1d7318229491ef0) Thanks [@adbayb](https://github.com/adbayb)! - Add more options to `helpers.message` to configure line breaks and no default label display.

- [`e5b2458`](https://github.com/adbayb/termost/commit/e5b24586ab5e460c9d509928799940b86ec62763) Thanks [@adbayb](https://github.com/adbayb)! - Message helper accepts now a boolean to configure line breaks at once for all positions.

## 1.2.0

### Minor Changes

- [`b4224bc`](https://github.com/adbayb/termost/commit/b4224bc11098b5c40a1629cf9cb081de8edb3211) Thanks [@adbayb](https://github.com/adbayb)! - Update `termost(input)` input contract to allow a single configuration object and make name, version, and description fields required.

## 0.18.0

### Minor Changes

- [`ef758a6`](https://github.com/adbayb/termost/commit/ef758a65119a3693160d3f12b813beb4255574cf) Thanks [@adbayb](https://github.com/adbayb)! - Display uncaught error by default and allow `helpers.message` to accept Error-like objects.

    Please note that the `helpers.message` do not accept anymore an array of strings.

## 0.17.0

### Minor Changes

- [`f090498`](https://github.com/adbayb/termost/commit/f090498b1c4dca3078dfdf558390d8793979fdcc) Thanks [@adbayb](https://github.com/adbayb)! - Reduce task error output noise.

## 0.16.0

### Minor Changes

- [`70d3dd0`](https://github.com/adbayb/termost/commit/70d3dd07466e5aff16108579646f62bd85cd3840) Thanks [@adbayb](https://github.com/adbayb)! - Log the stack trace in case of task error(s).

## 0.15.0

### Minor Changes

- [`73542c2`](https://github.com/adbayb/termost/commit/73542c289093ac4d964e90684095227f6a0f5309) Thanks [@adbayb](https://github.com/adbayb)! - Enable ES Module resolution by default.

## 0.14.0

### Minor Changes

- [`ad4aa85`](https://github.com/adbayb/termost/commit/ad4aa858bce68bf91c798b80b04a5c5cf37e85db) Thanks [@adbayb](https://github.com/adbayb)! - Make termost not runnable by removing uneeded bin folder.

### Patch Changes

- [`ef991db`](https://github.com/adbayb/termost/commit/ef991dbd3a1cfdab9a2bc19223a62266152b489b) Thanks [@adbayb](https://github.com/adbayb)! - Fix a version resolution regression.

## 0.13.2

### Patch Changes

- [`c344f46`](https://github.com/adbayb/termost/commit/c344f4606e8a3dd4731dc7ff60ebc9e72fd3eaa7) Thanks [@adbayb](https://github.com/adbayb)! - Help fallback prevents the version being displayed.

## 0.13.1

### Patch Changes

- [`7b157f6`](https://github.com/adbayb/termost/commit/7b157f6b5f165b7a732d2f50b1fba7c9fe52f617) Thanks [@adbayb](https://github.com/adbayb)! - Fix enquirer simulated cjs import in esm-only environment.

- [`2fb995f`](https://github.com/adbayb/termost/commit/2fb995fb4c6543ab3ecd60f4e1a02d7995a7d943) Thanks [@adbayb](https://github.com/adbayb)! - Make package metadata resolution compatible with esm-only environment.

## 0.13.0

### Minor Changes

- [`0d66524`](https://github.com/adbayb/termost/commit/0d66524a1347c4c834619cebf5f9005e05b548f3) Thanks [@adbayb](https://github.com/adbayb)! - Implement help fallback if the default command has no output.

- [`31329c1`](https://github.com/adbayb/termost/commit/31329c1b56032fb1603cc2d54c5551aecfe6d53c) Thanks [@adbayb](https://github.com/adbayb)! - Update dependencies.

## 0.12.1

### Patch Changes

- [#31](https://github.com/adbayb/termost/pull/31) [`84ce62c`](https://github.com/adbayb/termost/commit/84ce62c1a83db1cf2413edcdcdb64d63195247af) Thanks [@garronej](https://github.com/garronej)! - Fixes always crash if can't resolve metadata

## 0.12.0

### Minor Changes

- [`b365ee6`](https://github.com/adbayb/termost/commit/b365ee6d047c0dbef64e3651251b98881267766a) Thanks [@adbayb](https://github.com/adbayb)! - Replace chalk with picocolors

## 0.11.1

### Patch Changes

- [`917e380`](https://github.com/adbayb/termost/commit/917e3800f2bb848be4ca1c8b3279e8d0e4409250) Thanks [@adbayb](https://github.com/adbayb)! - Fix regression on CJS module by downgrading Chalk version

## 0.11.0

### Minor Changes

- [`50ae237`](https://github.com/adbayb/termost/commit/50ae237c4269f624bd707976dc61c0f9fbddebb2) Thanks [@adbayb](https://github.com/adbayb)! - Installation size optimization by introducing the following updates:
    - Chalk major bump
    - Litsr2 major bump
    - Prompts replaced in favor of Enquirer

## 0.10.0

### Minor Changes

- [`e924eac`](https://github.com/adbayb/termost/commit/e924eaca807c7dd78c889ad6506825b25aa8a96f) Thanks [@adbayb](https://github.com/adbayb)! - Allow promise as a return value for unkeyed handlers

### Patch Changes

- [`d8177ee`](https://github.com/adbayb/termost/commit/d8177eed3aa6a7351637a15285b33365e97fbae4) Thanks [@adbayb](https://github.com/adbayb)! - Fix task key autocompletion
