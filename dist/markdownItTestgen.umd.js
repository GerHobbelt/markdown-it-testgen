/*! markdown-it-testgen 0.1.6-21 https://github.com//GerHobbelt/markdown-it-testgen @license MIT */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('assert'), require('path'), require('fs'), require('js-yaml')) :
  typeof define === 'function' && define.amd ? define(['assert', 'path', 'fs', 'js-yaml'], factory) :
  (global = global || self, global.markdownitTestgen = factory(global.assert, global.path, global.fs, global.jsYaml));
}(this, (function (assert, p, fs, yaml) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
  var p__default = /*#__PURE__*/_interopDefaultLegacy(p);
  var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
  var yaml__default = /*#__PURE__*/_interopDefaultLegacy(yaml);

  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }

  function isString(obj) {
    return _class(obj) === '[object String]';
  }

  function isFunction(obj) {
    return _class(obj) === '[object Function]';
  }

  function isArray(obj) {
    return _class(obj) === '[object Array]';
  }

  function fixLF(str) {
    return str.length ? str + '\n' : str;
  }

  function parse(input, options) {
    const lines = input.split(/\r?\n/g);
    const max = lines.length;
    let min = 0;
    let line = 0;
    let fixture, i, l, currentSep, blockStart;
    const result = {
      fixtures: []
    };
    const sep = options.sep || ['.']; // Try to parse meta

    if (/^-{3,}$/.test(lines[0] || '')) {
      line++;

      while (line < max && !/^-{3,}$/.test(lines[line])) {
        line++;
      } // If meta end found - extract range


      if (line < max) {
        result.meta = lines.slice(1, line).join('\n');
        line++;
        min = line;
      } else {
        // if no meta closing - reset to start and try to parse data without meta
        line = 1;
      }
    } // Scan fixtures


    while (line < max) {
      if (sep.indexOf(lines[line]) < 0) {
        line++;
        continue;
      }

      currentSep = lines[line];
      fixture = {
        type: currentSep,
        header: '',
        first: {
          text: '',
          range: []
        },
        second: {
          text: '',
          range: []
        }
      };
      line++;
      blockStart = line; // seek end of first block

      while (line < max && lines[line] !== currentSep) {
        line++;
      }

      if (line >= max) {
        break;
      }

      fixture.first.text = fixLF(lines.slice(blockStart, line).join('\n'));
      fixture.first.range.push(blockStart, line);
      line++;
      blockStart = line; // seek end of second block

      while (line < max && lines[line] !== currentSep) {
        line++;
      }

      if (line >= max) {
        break;
      }

      fixture.second.text = fixLF(lines.slice(blockStart, line).join('\n'));
      fixture.second.range.push(blockStart, line);
      line++; // Look back for header on 2 lines before texture blocks

      i = fixture.first.range[0] - 2;

      while (i >= Math.max(min, fixture.first.range[0] - 3)) {
        l = lines[i];

        if (sep.indexOf(l) >= 0) {
          break;
        }

        if (l.trim().length) {
          fixture.header = l.trim();
          break;
        }

        i--;
      }

      result.fixtures.push(fixture);
    }

    return result.meta || result.fixtures.length ? result : null;
  } // Read fixtures recursively, and run iterator on parsed content
  //
  // Options
  //
  // - sep (String|Array) - allowed fixture separator(s)
  //
  // Parsed data fields:
  //
  // - file (String): file name
  // - meta (Mixed):  metadata from header, if exists
  // - fixtures
  //


  function load(path, options, iterator) {
    let input,
        parsed,
        stat = fs__default['default'].statSync(path);

    if (isFunction(options)) {
      iterator = options;
      options = {
        sep: ['.']
      };
    } else if (isString(options)) {
      options = {
        sep: options.split('')
      };
    } else if (isArray(options)) {
      options = {
        sep: options
      };
    }

    if (stat.isFile()) {
      input = fs__default['default'].readFileSync(path, 'utf8');
      parsed = parse(input, options);

      if (!parsed) {
        return null;
      }

      parsed.file = path;

      try {
        const src = parsed.meta || '';

        if (src.trim() === '') {
          parsed.meta = null;
        } else {
          parsed.meta = yaml__default['default'].load(src);
        }
      } catch (ex) {
        console.error('markdon-it-testgen: META parse error:', ex);
        parsed.meta = null;
      }

      if (iterator) {
        iterator(parsed);
      }

      return parsed;
    }

    let result, res;

    if (stat.isDirectory()) {
      result = [];
      fs__default['default'].readdirSync(path).forEach(function (name) {
        res = load(p__default['default'].join(path, name), options, iterator);

        if (Array.isArray(res)) {
          result = result.concat(res);
        } else if (res) {
          result.push(res);
        }
      });
      return result;
    } // Silently ignore other entries (symlinks and so on)


    return null;
  }

  const generate = function generate(path, options, md, env) {
    if (!md && options.render) {
      md = options;
      options = {};
    }

    env = env || {};
    options = Object.assign({}, options);
    options.assert = options.assert || assert__default['default'];
    load(path, options, function (data) {
      data.meta = Object.assign({}, data.meta); // options.desc wins over metadata, which itself wins over the path-based description generator calls in here:

      const desc = '' + (options.desc || data.meta.desc || p__default['default'].relative(path, data.file) || p__default['default'].basename(data.file)); // ^ the result is cast to a string as meta.desc MAY be a number of other implicit type originating from
      //   the YAML parser, e.g. `desc: 123` in your YAML would produce a *number* rather than a *string*.

      options.assert.strictEqual(typeof desc, 'string', 'every test series is expected to come with a decent title');
      options.assert(desc.length > 0, 'every test series is expected to come with a decent *non-empty* title');
      (data.meta.skip ? describe.skip : describe)(desc, function () {
        data.fixtures.forEach(function (fixture) {
          const testTitle = fixture.header && options.header ? fixture.header : 'line ' + (fixture.first.range[0] - 1);

          if (options.test) {
            options.test(it, testTitle, fixture, options, md, Object.assign({}, env));
          } else {
            it(testTitle, function () {
              options.assert.strictEqual(md.render(fixture.first.text, Object.assign({}, env)), fixture.second.text);
            });
          }
        });
      });
    });
  };

  generate.load = load;

  return generate;

})));
//# sourceMappingURL=markdownItTestgen.umd.js.map
