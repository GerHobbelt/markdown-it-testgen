# markdown-it-testgen

[![Node.js CI](https://github.com/GerHobbelt/markdown-it-testgen/actions/workflows/node.js.yml/badge.svg)](https://github.com/GerHobbelt/markdown-it-testgen/actions/workflows/node.js.yml)
![CircleCI](https://img.shields.io/circleci/build/github/GerHobbelt/markdown-it-testgen)
[![NPM version](https://img.shields.io/npm/v/markdown-it-testgen.svg?style=flat)](https://www.npmjs.org/package/markdown-it-testgen)


> This package parses fixtures in commonmark spec format and generates tests for
[markdown-it](https://github.com/markdown-it/markdown-it) parser and
[plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


```bash
npm install markdown-it-testgen
```


## Fixture format

Each fixture can have optional metadata in yaml format:

```yaml
---
desc: Batch description # file name used if not exists.
skip: true              # mark batch as pending
---
```

Then tests should follow in this format:

```
optional header
.
source
data
.
parsed
data
.


header2
.
src
.
result
.
```

If header missed - line number will be used instead.


## API

### generate: `module.exports(path, options, md, env)`

- __path__ - file or directory name
- __options__ (not mandatory)
  - __header__ - Set `true` to use fixture headers for test names or `false` to use fixture line numbers for test names like so: "line 123". Default `false`. 
  - __sep__ - array of allowed separators for samples, `[ '.' ]` by default
  - __assert__ - custom assertion package, `require('assert')` by default.

    The `assert` library you supply must at least provide these member functions:

    + `assert.strictEqual(a, b, message)`
    + `assert(booleanTestResult, message)`

  - __test__ - optional test function which will be used instead of the global `it(...)` test function when provided.

    The `test()` function is invoked like so:

    `options.test(it, testTitle, fixture, options, md, Object.assign({}, env))`

    where:
    - `it` is a reference to the global `it()` test function (which must have been set up by your test framework)
    - `testTitle` is either the `fixture.header` or a 'line 123' string listing the starting line of the fixture test spec block.
    - `fixture` is a reference to the current fixture record, the format of which is described further below at *parse record fixture*
    - `options` is a reference to the *shallow copy* of the `options` instance
    - `md` is a reference to the user-provided `md` markdown-it instance as described further below.
    - `env` is a *shallow copy* of the user-provided `env` structure as described further below.  

    The `options.test()` callback allows the creation of arbitrary fixture-file based test rigs, whether it is for markdown-it or another library. See [the 'generator correctly handles options.test user-defined test function' test](test/test.js) for an example.

- __md__ - `markdown-it` instance to parse and compare samples

  The `md` instance is expected to contain a `render` function member, which will be invoked like `md.render(fixture.first.text, Object.assign({}, env))`.
- __env__ (not mandatory) - environment object to be passed through to `markdown-it.render()`


### module.exports.load(path, options, iterator)

For each loaded file: parse and pass data to iterator function. 
Currently used for tests only.

Returns `NULL` (when no fixture file could be found in the given directory) or a non-empty array of *parse records*.
The *parse record* structure is described further below at the `options.iterator` option.

- __path__ - file or directory name

  When the `path` is a directory, it is traversed rescursively to load all files within. 
  Every non-empty file will be parsed as a single fixture record.
- __options__ (not mandatory)
  - __sep__ - array of allowed separators for samples, `[ '.' ]` by default

  **Note**: when the `options` are a **string** instead of an options **object**, the `options` string is assumed to be a string of separator characters, which will be split into an array of seaprators like so: `options = { sep: options.split('') }`.

- __iterator__ - every non-empty parsed file will invoke the `iterator(record)` callback once, passing 
  a *parse record* with the following structure:

  - __meta__ - the YAML-parsed *frontmatter* metadata at the head of the loaded fixture file -- this *frontmatter* metadata must be enclosed between a top and bottom line containing only a `---` separator as is usual with MarkDown frontmatter.
  - __file__ - the path to the actual file loaded & parsed.
  - __fixtures__ - an array with **zero or more** fixture records with the following structure:
    + __header__ - (possibly empty) header/title.
    
      This can serve as a test descriptor/title and is a trimmed copy of the last non-empty line of text preceding the fixture test spec itself.
    + __type__ - identifies the separator used for this particular fixture test spec. `'.'` by default.
    + __first__ - object:
      + __text__ - the first text extracted from the fixture test spec block
      + __range__ - array listing both the starting and ending line numbers for this text
    + __second__ - object:
      + __text__ - the second text extracted from the fixture test spec block
      + __range__ - array listing both the starting and ending line numbers for this text


## License

[MIT](https://github.com/markdown-it/markdown-it-testgen/blob/master/LICENSE)

