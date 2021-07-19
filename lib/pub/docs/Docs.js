
/*
Configuration
-------------

Default configuration **options**. All of these may be extended by
user-specified options.
*/
/*
**Configure** this particular run of Docco. We might use a passed-in external
template, or one of the built-in **layouts**. We only attempt to process
source files for languages for which we have definitions.
 */
var Docs, configure, docs;

import _ from 'underscore';

import fs from 'fs-extra';

import path from 'path';

import marked from 'marked';

import commander from 'commander';

import highlightjs from 'highlight.js';

import languages from '../../doc/public/json/languages.json';

Docs = class Docs {
  constructor() {}

  createDoc(options = {}, callback) {
    var config;
    config = configure(options);
    return fs.mkdirs(config.output, function() {
      var complete, copyAsset, files, nextFile;
      callback || (callback = function(error) {
        if (error) {
          throw error;
        }
      });
      copyAsset = function(file, callback) {
        if (!fs.existsSync(file)) {
          return callback();
        }
        return fs.copy(file, path.join(config.output, path.basename(file)), callback);
      };
      complete = function() {
        return copyAsset(config.css, function(error) {
          if (error) {
            return callback(error);
          }
          if (fs.existsSync(config.public)) {
            return copyAsset(config.public, callback);
          }
          return callback();
        });
      };
      files = config.sources.slice();
      nextFile = function() {
        var source;
        source = files.shift();
        return fs.readFile(source, function(error, buffer) {
          var code, sections;
          if (error) {
            return callback(error);
          }
          code = buffer.toString();
          sections = parse(source, code, config);
          format(source, sections, config);
          write(source, sections, config);
          if (files.length) {
            return nextFile();
          } else {
            return complete();
          }
        });
      };
      return nextFile();
    });
  }

  /*
  Given a string of source code, **parse** out each block of prose and the code that
  follows it — by detecting which is which, line by line — and then create an
  individual **section** for it. Each section is an object with `docsText` and
  `codeText` properties, and eventually `docsHtml` and `codeHtml` as well.
  */
  parse(source, code, config = {}) {
    var codeText, docsText, hasCode, i, isText, j, k, lang, len, len1, line, lines, match, maybeCode, save, sections;
    lines = code.split('\n');
    sections = [];
    lang = getLanguage(source, config);
    hasCode = '';
    docsText = '';
    codeText = '';
    save = function() {
      sections.push({docsText, codeText});
      return hasCode = docsText = codeText = '';
    };
    /*
    Our quick-and-dirty implementation of the literate programming style. Simply
    invert the prose and code relationship on a per-line basis, and then continue as
    normal below.
    */
    if (lang.literate) {
      isText = true;
      maybeCode = true;
      for (i = j = 0, len = lines.length; j < len; i = ++j) {
        line = lines[i];
        lines[i] = maybeCode && (match = /^([ ]{4}|[ ]{0,3}\t)/.exec(line)) ? (isText = false, line.slice(match[0].length)) : (maybeCode = /^\s*$/.test(line)) ? isText ? lang.symbol : '' : (isText = true, lang.symbol + ' ' + line);
      }
    }
    for (k = 0, len1 = lines.length; k < len1; k++) {
      line = lines[k];
      if (line.match(lang.commentMatcher) && !line.match(lang.commentFilter)) {
        if (hasCode) {
          save();
        }
        docsText += (line = line.replace(lang.commentMatcher, '')) + '\n';
        if (/^(---+|===+)$/.test(line)) {
          save();
        }
      } else {
        hasCode = true;
        codeText += line + '\n';
      }
    }
    return save();
  }

  /*
  To **format** and highlight the now-parsed sections of code, we use **Highlight.js**
  over stdio, and run the text of their corresponding comments through
  **Markdown**, using [Marked](https://github.com/chjj/marked).
  Pass any user defined options to Marked if specified via command line option
   */
  format(source, sections, config) {
    var code, i, j, language, len, markedOptions, results, section;
    language = this.getLanguage(source, config);
    markedOptions = {
      smartypants: true
    };
    if (config.marked) {
      markedOptions = config.marked;
    }
    marked.setOptions(markedOptions);
    /*
    Tell Marked how to highlight code blocks within comments, treating that code
    as either the language specified in the code block or the language of the file
    if not specified.
    */
    marked.setOptions({
      highlight: function(code, lang) {
        lang || (lang = language.name);
        if (highlightjs.getLanguage(lang)) {
          return highlightjs.highlight(lang, code).value;
        } else {
          console.warn(`docco: couldn't highlight code block with unknown language '${lang}' in ${source}`);
          return code;
        }
      }
    });
    results = [];
    for (i = j = 0, len = sections.length; j < len; i = ++j) {
      section = sections[i];
      code = highlightjs.highlight(language.name, section.codeText).value;
      code = code.replace(/\s+$/, '');
      section.codeHtml = `<div class='highlight'><pre>${code}</pre></div>`;
      results.push(section.docsHtml = marked(section.docsText));
    }
    return results;
  }

  /*
  Once all of the code has finished highlighting, we can **write** the resulting
  documentation file by passing the completed HTML sections into the template,
  and rendering it to the specified output path.
  */
  write(source, sections, config) {
    /*
    The **title** of the file is either the first heading in the prose, or the
    name of the source file.
    */
    var css, destination, first, firstSection, hasTitle, html, relative, title;
    destination = function(file) {
      return path.join(config.output, path.dirname(file), path.basename(file, path.extname(file)) + '.html');
    };
    relative = function(file) {
      var from, to;
      to = path.dirname(path.resolve(file));
      from = path.dirname(path.resolve(destination(source)));
      return path.join(path.relative(from, to), path.basename(file));
    };
    firstSection = _.find(sections, function(section) {
      return section.docsText.length > 0;
    });
    if (firstSection) {
      first = marked.lexer(firstSection.docsText)[0];
    }
    hasTitle = first && first.type === 'heading' && first.depth === 1;
    title = hasTitle ? first.text : path.basename(source);
    css = relative(path.join(config.output, path.basename(config.css)));
    html = config.template({
      sources: config.sources,
      css,
      title,
      hasTitle,
      sections,
      path,
      destination,
      relative
    });
    console.log(`docco: ${source} -> ${destination(source)}`);
    return fs.outputFileSync(destination(source), html);
  }

};

configure = function(options) {
  var config, dir;
  config = _.extend({}, this.defaults(), _.pick(options.opts(), ..._.keys(this.defaults())));
  config.languages = buildMatchers(config.languages);
  /*
  The user is able to override the layout file used with the `--template` parameter.
  In this case, it is also neccessary to explicitly specify a stylesheet file.
  These custom templates are compiled exactly like the predefined ones, but the `public` folder
  is only copied for the latter.
  */
  if (options.template) {
    if (!options.css) {
      console.warn("docco: no stylesheet file specified");
    }
    config.layout = null;
  } else {
    dir = config.layout = path.join(__dirname, 'resources', config.layout);
    if (fs.existsSync(path.join(dir, 'public'))) {
      config.public = path.join(dir, 'public');
    }
    config.template = path.join(dir, 'docco.jst');
    config.css = options.css || path.join(dir, 'docco.css');
  }
  config.template = _.template(fs.readFileSync(config.template).toString());
  if (options.marked) {
    config.marked = JSON.parse(fs.readFileSync(options.marked));
  }
  config.sources = options.args.filter(function(source) {
    var lang;
    lang = this.getLanguage(source, config);
    if (!lang) {
      console.warn(`docco: skipped unknown type (${path.basename(source)})`);
    }
    return lang;
  }).sort();
  config;
  return {
    /*
    Build out the appropriate matchers and delimiters for each language.
    */
    buildMatchers: function() {
      var ext, l, results;
      results = [];
      for (ext in languages) {
        l = languages[ext];
        l.commentMatcher = RegExp(`^\\s*${l.symbol}\\s?`);
        l.commentFilter = /(^#![\/]|^\s*#\{)/;
        results.push(languages);
      }
      return results;
    },
    /*
    A function to get the current language we're documenting, based on the
    file extension. Detect and tag "literate" `.ext.md` variants.
    */
    getLanguage: function(source, config) {
      var codeExt, codeLang, ext, lang, ref, ref1;
      ext = config.extension || path.extname(source) || path.basename(source);
      lang = ((ref = config.languages) != null ? ref[ext] : void 0) || languages[ext];
      if (lang && lang.name === 'markdown') {
        codeExt = path.extname(path.basename(source, ext));
        codeLang = ((ref1 = config.languages) != null ? ref1[codeExt] : void 0) || languages[codeExt];
        if (codeExt && codeLang) {
          lang = _.extend({}, codeLang, {
            literate: true
          });
        }
      }
      return lang;
    },
    defaults: function() {
      return {
        layout: 'parallel',
        output: 'docs',
        template: null,
        css: null,
        extension: null,
        marked: null,
        languages: this.buildMatchers()
      };
    },
    /*
    Command Line Interface
    ----------------------

    Finally, let's define the interface to run Docco from the command line.
    Parse options using [Commander](https://github.com/visionmedia/commander.js).
    */
    run: function(args = process.argv) {
      var c, version;
      version = "1.0.0";
      c = this.defaults();
      commander.version(version).usage('[options] files').option('-L, --languages [file]', 'use a custom languages.json', _.compose(JSON.parse, fs.readFileSync)).option('-l, --layout [name]', 'choose a layout (parallel, linear or classic)', c.layout).option('-o, --output [path]', 'output to a given folder', c.output).option('-c, --css [file]', 'use a custom css file', c.css).option('-t, --template [file]', 'use a custom .jst template', c.template).option('-e, --extension [ext]', 'assume a file extension for all inputs', c.extension).option('-m, --marked [file]', 'use custom marked options', c.marked).parse(args).name = "docco";
      if (commander.args.length) {
        return this.createDoc(commander);
      } else {
        return console.log(commander.helpInformation());
      }
    }
  };
};

// Docco = module.exports = {run, document, parse, format, version}
docs = new Docs();

export {
  docs
};

//# sourceMappingURL=Docs.js.map
