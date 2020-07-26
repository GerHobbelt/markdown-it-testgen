# 0.1.6-16 (2020/7/26)

- Maintenance release.


# 0.1.6-15 (2020/7/6)

## Features

- changed `options.test` method interface to `function (it, title, fixture, options, md, env)` for maximum flexibility: added are the `it` and `title` parameters and the `test()` function is now expected to *generate* a test using the `it()` function. (Hm, maybe a rename from `test` to `testgen` is in order?)
  ([9a96473c](https://github.com/GerHobbelt/markdown-it-testgen/commit/9a96473c))


# 0.1.6-14 (2020/7/6)

## Testing

- removed the need for the generator empty 'md' object hack to be able to easily use `options.test`: now the code performs a minimal sanity check to see if the potential md object has the mandatory bits (read: a `render()` function)
  ([f380bb8a](https://github.com/GerHobbelt/markdown-it-testgen/commit/f380bb8a))


# 0.1.6-13 (2020/7/6)

## Bug Fixes

- **any:** added `options.test` function: this can be used to produce customized tests based on the fixtures' data.
  Interface: `options.test(fixture, options, md, env)`
  ([38805213](https://github.com/GerHobbelt/markdown-it-testgen/commit/38805213))


# 0.1.6-12 (2020/7/5)

## Bug Fixes

- Tested the new code with markdown-it-dirty-dozen.

  Added fixes for test description issue uncovered there:
  - options.desc must win over meta.desc
  - test description obtained from meta (or options) MAY be a number or other type: cast it to string before using it
  ([89bd5d49](https://github.com/GerHobbelt/markdown-it-testgen/commit/89bd5d49))


# 0.1.6-11 (2020/7/5)

## Features

- provide two ways to override the test set description: `options.desc` (the options object are the options of generate/load, not markdown-it, so this is safe anyway) and ultimately the code takes the filename of the fixture as-is (basename).
  ([5daeb0c4](https://github.com/GerHobbelt/markdown-it-testgen/commit/5daeb0c4))


# 0.1.6-10 (2020/7/5)

## Bug Fixes

- **any:** Changes:
  - improve test coverage
    - added test for the `load()` API: check to make sure the loaded files are correctly parsed. This test has been constructed such that it also tests the single-file-in-directory path inside load()
    - added test for the `generate()` API by letting it generate (and execute) a set of dummy tests, which MUST pass.
      This test re-uses the same set of fixture files as the other test to maximize usefulness of those 'dummy files'.
  - remove object.assign npm package: Node 10+ has this built-in
  - remove chai package: Node assert is powerful enough and nobody should be enforced to load an extra test package if they don't want (or need) to.
    Proper test execution is guaranteed by the added tests above: everyone can expect their `generate()`d tests to pass/fail as before.
  ([cc733f03](https://github.com/GerHobbelt/markdown-it-testgen/commit/cc733f03))

## Testing

- Changes:
  - added another test to test the `generate()` API, now with minimal parameters (while we aim for 100% coverage :) )
  - there's some weird sh*t going on with `nyc` as it reports an inexplicable line as not covered yet, even after moving the code to a "single statement per line" format. Shuffling the functions around can trigger a whole series of other lines being reported as 'not covered', so there's some very odd interplay between `microbundle` and `nyc` perhaps?!?!
  ([de74a3c6](https://github.com/GerHobbelt/markdown-it-testgen/commit/de74a3c6))


# 0.1.6-9 (2020/7/3)

## Features

- fix/feature: add meta override parameter to generate() function -- turns out some tests don't produce a decent title and this way we can override the standard heuristic -- bug was discovered in markdown-it-dirty-dozen.
  ([c9fd9855](https://github.com/GerHobbelt/markdown-it-testgen/commit/c9fd9855))


# 0.1.6-8 (2020/6/17)

## Chore

- Changes:
  - synced with template markdown-it plugin build tooling files
  ([df09544b](https://github.com/GerHobbelt/markdown-it-testgen/commit/df09544b))


# 0.1.6-7 (2020/4/4)

## Bug Fixes

- Changes:
  - package.json to reduce vulnerabilities
    The following vulnerabilities are fixed with an upgrade:
    - https://snyk.io/vuln/npm:lodash:20180130
    
    Latest report for markdown-it/markdown-it-testgen:
    https://snyk.io/test/github/markdown-it/markdown-it-testgen
    ([9c2a7494](https://github.com/GerHobbelt/markdown-it-testgen/commit/9c2a7494))

## Testing

- Changes:
  - patched eslint to make the build and test run pass: warnings instead of errors for the mocha/assert globals
    ([8ff330bc](https://github.com/GerHobbelt/markdown-it-testgen/commit/8ff330bc))
  - Allow optionally passing `env` to tests
    ([67a5698b](https://github.com/GerHobbelt/markdown-it-testgen/commit/67a5698b))

## Documentation

- Add documentation for passing `env`
  ([d12ecad3](https://github.com/GerHobbelt/markdown-it-testgen/commit/d12ecad3))

## Miscellaneous

- Changes:
  - added 'prep' and 'superclean' make targets to help clean and re-install NPM package dependencies
    ([e016812c](https://github.com/GerHobbelt/markdown-it-testgen/commit/e016812c))
  - add `npm run pub` publish task for scoped packages
    ([f99dbee6](https://github.com/GerHobbelt/markdown-it-testgen/commit/f99dbee6))
  - synced build/environment files with main project: markdown-it
    ([45949bd8](https://github.com/GerHobbelt/markdown-it-testgen/commit/45949bd8))
  - Switch `env` to final position
    
    This way we can differentiate between `options` and `env`
    ([e3e1e42c](https://github.com/GerHobbelt/markdown-it-testgen/commit/e3e1e42c))
  - Use _.clone instead of adding a dependency on merge
    ([81ddd5bb](https://github.com/GerHobbelt/markdown-it-testgen/commit/81ddd5bb))


# 0.1.6 (2019/7/9)

## Miscellaneous

- Deps bump
  ([8bda5fef](https://github.com/GerHobbelt/markdown-it-testgen/commit/8bda5fef))
- Remove outdated node versions from travis.
  ([a4f7b56c](https://github.com/GerHobbelt/markdown-it-testgen/commit/a4f7b56c))


# 0.1.5 (2019/3/12)

- Maintenance release.
- Drop lodash use.
- Pin dev deps.
- Add latest node to travis.
- Cleanup `package.json`.

## Miscellaneous

- Changes:
  - Drop lodash use
    ([023c23ea](https://github.com/GerHobbelt/markdown-it-testgen/commit/023c23ea))
  - added 'prep' and 'superclean' make targets to help clean and re-install NPM package dependencies
    ([e016812c](https://github.com/GerHobbelt/markdown-it-testgen/commit/e016812c))
  - add `npm run pub` publish task for scoped packages
    ([f99dbee6](https://github.com/GerHobbelt/markdown-it-testgen/commit/f99dbee6))
  - make this a scoped npm package.
    ([7e9ba40e](https://github.com/GerHobbelt/markdown-it-testgen/commit/7e9ba40e))


# 0.1.5-1 (2017/8/5)

## Testing

- Allow optionally passing `env` to tests
  ([67a5698b](https://github.com/GerHobbelt/markdown-it-testgen/commit/67a5698b))

## Documentation

- Add documentation for passing `env`
  ([d12ecad3](https://github.com/GerHobbelt/markdown-it-testgen/commit/d12ecad3))

## Miscellaneous

- synced build/environment files with main project: markdown-it
  ([45949bd8](https://github.com/GerHobbelt/markdown-it-testgen/commit/45949bd8))
- Switch `env` to final position
    
  This way we can differentiate between `options` and `env`
  ([e3e1e42c](https://github.com/GerHobbelt/markdown-it-testgen/commit/e3e1e42c))


# 0.1.4 (2015/1/12)

## Bug Fixes

- Fixed swapped params in error reports
  ([09976176](https://github.com/GerHobbelt/markdown-it-testgen/commit/09976176))


# 0.1.3 (2015/1/12)

## Miscellaneous

- Changes:
  - Added option to pass custom assertion object.
    ([a515d963](https://github.com/GerHobbelt/markdown-it-testgen/commit/a515d963))
  - Use `chai` assertions by default.
    ([a515d963](https://github.com/GerHobbelt/markdown-it-testgen/commit/a515d963))


# 0.1.2 (2014/12/23)

- One more maintenance release :)


# 0.1.1 (2014/12/22)

- Maintenance release.

## Miscellaneous

- Changes:
  - cleanup
    ([74c1402d](https://github.com/GerHobbelt/markdown-it-testgen/commit/74c1402d))
  - Added license
    ([2d917080](https://github.com/GerHobbelt/markdown-it-testgen/commit/2d917080))


# 0.1.0 (2014/12/20)

- First release.

