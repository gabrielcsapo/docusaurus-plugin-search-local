## v1.0.1 (2023-05-11)

#### :bug: Bug Fix

- [#70](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/pull/70) Removing types-only packages from peerDependencies ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v1.0.0 (2023-04-26)

#### :rocket: Enhancement

- [#69](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/pull/69) Upgrades docusaurus to 2.4.0 ([@scalvert](https://github.com/scalvert))
- [#67](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/pull/67) Adding validate-peer-dependencies to ensure peerDeps ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- [#68](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/pull/68) Adding version tester action ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.10.1 (2023-03-31)

#### :house: Internal

- [#66](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/pull/66) Updates configuration to correctly exclude files from package contents ([@scalvert](https://github.com/scalvert))
- [#65](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/pull/65) deps: Moving deps to dev/peer deps to allow the host site to provide those versions ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## [0.10.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.9.0...0.10.0) (2023-03-06)

### Features

- adds support for Azure App Insights as an analytics source ([#64](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/issues/64)) ([beab47f](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/beab47fff92a00d9bec18fa099f9ee7a4a081a6b))

### Bug Fixes

- adds .yarnrc.yml to ensure local linkage (non pnp use) ([ff5d78c](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/ff5d78cd706f97ff4633ef3eabcd4b99bb2848bd))

## [0.9.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.8.2...0.9.0) (2022-10-26)

### Features

- allow search terms to exist in middle of word ([#57](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/issues/57)) ([a1b5923](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/a1b5923cf68257f04f9519b9950688f254d8544a))
- show results with additional context ([#58](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/issues/58)) ([f5e9ebb](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/f5e9ebbef7dff01cb71c3261b57fbf21956eb492))

### Bug Fixes

- highlight functionality is not guarded by option passed in ([#56](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/issues/56)) ([97db2f3](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/97db2f364aad6fac815af728d1e372da1b0b71ef))
- issue with infinite loop on search page ([95cdb05](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/95cdb0589d672ce608bc21db0d325e097c67b4cf))

### [0.8.2](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.8.1...0.8.2) (2022-07-29)

### Bug Fixes

- bug gtag is not defined ([7f800fa](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/7f800fa2c6cb643c6e8e741a45c82742f61a10f0))

### [0.8.1](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.8.0...0.8.1) (2022-07-29)

### Bug Fixes

- fixes gtag implementation ([4de8b3e](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/4de8b3eaa2b0a1f35818d7393850b9bfcb758982))

## [0.8.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.7.0...0.8.0) (2022-07-29)

### Features

- adds google analytics site search compatibility ([87cdf65](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/87cdf65320f93751714afa0542faafae3edff798))

## [0.7.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.5.0...0.7.0) (2022-07-08)

### Features

- updates @docusaurus/\* to 2.0.0-beta.22 ([0222094](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/0222094dd7e93e390a1878c02d86e30f58336037))

## [0.6.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.5.0...0.6.0) (2022-05-25)

## [0.5.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.4.0...0.5.0) (2022-04-07)

## [0.4.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.5...0.4.0) (2022-03-01)

### [0.3.5](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.4...0.3.5) (2022-02-25)

### Bug Fixes

- ensures urls with overlapping segments doesn't remove the protocol ([128c2f5](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/128c2f594ef5828adcee7a3d10524128396e3e9f))

### [0.3.4](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.3...0.3.4) (2022-02-24)

### Bug Fixes

- handle complex overlapping external routes ([89ed6fa](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/89ed6fa6aa4bfc54d4e09b7b1abf04fc72f84db5))

### [0.3.3](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.2...0.3.3) (2022-02-23)

### Bug Fixes

- adding prepublishOnly script ([734b00b](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/734b00bfc4ac4497303234711d8489a155dcfb4c))

### [0.3.2](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.1...0.3.2) (2022-02-23)

### Bug Fixes

- fixing color contrast in search modal ([9c638b3](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/9c638b3db5d95b5a94b50d4f7bcd93ed3299504e))

### [0.3.1](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.0...0.3.1) (2022-02-23)

### Bug Fixes

- handle errors when fetching search index ([d714954](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/d714954f84ace613a079db2a44836784bfffcfdd))
- using infima colors instead of custom colors ([c49c2fc](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/c49c2fc5d184a8c3ed2344bcdb823a26c74b8af3))

# [0.3.0](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/compare/0.3.0-beta.1...0.3.0) (2022-02-17)

### Bug Fixes

- Fixing no docs found text ([f2717dc](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/f2717dce845b4d8b63126af4da6b1fd572a787c5))
- missing field in tests ([3383d5b](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/3383d5b0dcd8f9bbf88c19861d81a6747790ed41))
- package-lock did not update for some reason ([a08e46d](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/a08e46d766c37e882c72007269ff955f2fb38316))
- remove overflow-y from searchResultsSection ([612b36f](https://github.com/gabrielcsapo/docusaurus-plugin-search-local/commit/612b36f8605ede480b7138f105ce16d392f8efa6))

# 0.2.1 (01/11/2022)

- updates types in interfaces to include TranslationMap (@gabrielcsapo)

# 0.2.0 (01/11/2022)

- updates types to be published with package (@gabrielcsapo)

# 0.1.4

- @gabrielcsapo: ensure we are using the css variables to override for customization (fixes dark mode background)

# 0.1.3

- @gabrielcsapo: make debug a dependency instead of devDep.

# 0.1.2

- @gabrielcsapo: ensure that cursor position 0 can have enter action applied to it

# 0.1.1

- @gabrielcsapo: cleans up dark mode styling
- @gabrielcsapo: ensures that hover does not auto select item

# 0.1.0

- @gabrielcsapo: adds keyboard navigation and enables pressing enter to select items in the list.
- @gabrielcsapo: adds a search index to develop without a full build.
- @gabrielcsapo: disables tests for a major rewrite
- @gabrielcsapo: cleans up dependencies

# 0.0.1

- @gabrielcsapo: adds demo site and migrates tsconfig files to be collocated in either client or server.
- @gabrielcsapo: Makes sure we build css output necessary to build docs site.

# 0.0.0

- @gabrielcsapo: hard fork of https://github.com/easyops-cn/docusaurus-search-local with major UI changes.
