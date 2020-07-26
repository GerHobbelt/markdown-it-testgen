
/* eslint-env mocha, es6 */

let p       = require('path');
let assert  = require('assert');
let testgen = require('../');

describe('Generator', function () {

  it('should parse meta', function (done) {
    testgen.load(p.join(__dirname, 'fixtures/meta.txt'), function (data) {

      assert.deepEqual(data.meta, { desc: 123, skip: true });

      assert.strictEqual(data.fixtures.length, 1);
      assert.strictEqual(data.fixtures[0].first.text, '123\n');
      assert.strictEqual(data.fixtures[0].second.text, '456\n');
      done();
    });
  });

  it('should parse headers', function (done) {
    testgen.load(p.join(__dirname, 'fixtures/headers.txt'), function (data) {

      assert.strictEqual(data.fixtures.length, 3);

      assert.strictEqual(data.fixtures[0].header, '');
      assert.strictEqual(data.fixtures[0].first.text, '123\n');
      assert.strictEqual(data.fixtures[0].second.text, '456\n');

      assert.strictEqual(data.fixtures[1].header, 'header1');
      assert.strictEqual(data.fixtures[1].first.text, 'qwe\n');
      assert.strictEqual(data.fixtures[1].second.text, 'rty\n');

      assert.strictEqual(data.fixtures[2].header, 'header2');
      assert.strictEqual(data.fixtures[2].first.text, 'zxc\n');
      assert.strictEqual(data.fixtures[2].second.text, 'vbn\n');

      done();
    });
  });

  it('should parse multilines', function (done) {
    testgen.load(p.join(__dirname, 'fixtures/multilines.txt'), function (data) {

      assert.strictEqual(data.fixtures.length, 1);

      assert.strictEqual(data.fixtures[0].header, '');
      assert.strictEqual(data.fixtures[0].first.text, '123\n \n456\n');
      assert.strictEqual(data.fixtures[0].second.text, '789\n\n098\n');

      done();
    });
  });

  it('should not add \\n at empty to end of empty line', function (done) {
    testgen.load(p.join(__dirname, 'fixtures/empty.txt'), function (data) {

      assert.strictEqual(data.fixtures[0].first.text, 'a\n');
      assert.strictEqual(data.fixtures[0].second.text, '');

      done();
    });
  });

  it('should scan dir', function () {
    let files = 0;

    let result = testgen.load(p.join(__dirname, 'fixtures'), function () {
      files++;
    });
    assert.strictEqual(files, 4);
    assert.strictEqual(result.length, 4);
    for (let i = 0; i < result.length; i++) {
      let parseRecord = result[i];
      assert(parseRecord.fixtures.length >= 1, `file #${i} (${parseRecord.file}) has no fixtures?`);
    }
  });

  it('should scan dir recursively', function () {
    let files = [];
    let result = testgen.load(p.join(__dirname, 'fixture-1-plus'), function (data) {
      data.file = data.file.replace(/\\/g, '/').replace(/^.*(fixture-1-plus)/, '$1');
      files.push(data);
    });
    const sollwert = [
      {
        file: 'fixture-1-plus/dummy1.txt',
        fixtures: [
          {
            first: {
              range: [
                4,
                5
              ],
              text: '123\n'
            },
            header: '',
            second: {
              range: [
                6,
                7
              ],
              text: '456\n'
            },
            type: '.'
          },
          {
            first: {
              range: [
                11,
                12
              ],
              text: 'qwe\n'
            },
            header: 'reuteldereutel',
            second: {
              range: [
                13,
                14
              ],
              text: 'tzh\n'
            },
            type: '.'
          },
          {
            first: {
              range: [
                19,
                20
              ],
              text: 'zxc\n'
            },
            header: 'bamboebillen',
            second: {
              range: [
                21,
                22
              ],
              text: '}{f\n'
            },
            type: '.'
          }
        ],
        meta: undefined
      },
      {
        file: 'fixture-1-plus/subdir/dummy-meta.txt',
        fixtures: [
          {
            first: {
              range: [
                6,
                7
              ],
              text: '123\n'
            },
            header: '',
            second: {
              range: [
                8,
                9
              ],
              text: '456\n'
            },
            type: '.'
          }
        ],
        meta: {
          desc: 'another faked test',
          skip: false
        }
      }
    ];
    assert.deepEqual(files, sollwert);
    assert.deepEqual(result, sollwert);
  });
});

  // test the generate() API too:
describe('Generator should generate a series of (dummy) tests which pass', function () {
  // function generate(path, options, md, env)
  testgen(p.join(__dirname, 'fixture-1-plus'), {
  }, {
    render: function (first_text, env) {
      env.assign_test++;
      assert.strictEqual(env.this_is_env, true);
      assert.strictEqual(env.assign_test, 2);

      let rv = '';
      for (let i in first_text.trim()) {
        let ch = first_text.codePointAt(i);
        ch += 3;
        rv += String.fromCodePoint(ch);
      }

      return rv + '\n';
    }
  }, {
    this_is_env: true,
    assign_test: 1
  });
});

describe('Generator should generate a series of (dummy) tests which pass using minimal parameters', function () {
  // function generate(path, [options, ] md[, env])
  testgen(p.join(__dirname, 'fixture-1-plus'), {
    render: function (first_text, env) {
      // make sure `env` parameter is not NULL:
      assert.ok(env != null);

      let rv = '';
      for (let i in first_text.trim()) {
        let ch = first_text.codePointAt(i);
        ch += 3;
        rv += String.fromCodePoint(ch);
      }

      return rv + '\n';
    }
  });
});

// Without the options.desc override, this would trigger the internal description assert
// due to `path.relative(...)` producing an empty string.
describe('Generator should generate a series of (dummy) tests with a decent, non-empty title', function () {
  // function generate(path, [options, ] md)
  testgen(p.join(__dirname, 'fixture-1-plus/dummy1.txt'), {
    render: function (first_text, env) {
      // make sure `env` parameter is not NULL:
      assert.ok(env != null);

      let rv = '';
      for (let i in first_text.trim()) {
        let ch = first_text.codePointAt(i);
        ch += 3;
        rv += String.fromCodePoint(ch);
      }

      return rv + '\n';
    }
  });

  // function generate(path, options, md)
  testgen(p.join(__dirname, 'fixture-1-plus/dummy1.txt'), {
    desc: 'test title: overridden'
  }, {
    render: function (first_text, env) {
      // make sure `env` parameter is not NULL:
      assert.ok(env != null);

      let rv = '';
      for (let i in first_text.trim()) {
        let ch = first_text.codePointAt(i);
        ch += 3;
        rv += String.fromCodePoint(ch);
      }

      return rv + '\n';
    }
  });
});

describe('Generator correctly handles options.test user-defined test function', function () {
  // function generate(path, options, md)
  testgen(p.join(__dirname, 'fixture-1-plus/dummy1.txt'), {
    desc: 'test title: overridden',

    userdefRender: function (first_text, env) {
      // make sure `env` parameter is not NULL:
      assert.ok(env != null);

      let rv = '';
      for (let i in first_text.trim()) {
        let ch = first_text.codePointAt(i);
        ch += 3;
        rv += String.fromCodePoint(ch);
      }

      return rv + '\n';
    },

    test: function (_it_, title, fixture, options, md, env) {
      _it_(title, () => {
        options.assert.strictEqual(options.userdefRender(fixture.first.text, Object.assign({}, env)), fixture.second.text);
      });
    }
  });
});
