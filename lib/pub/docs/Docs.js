var Docs;

import _ from 'underscore';

import fs from 'fs-extra';

import path from 'path';

import marked from 'marked';

import highlightjs from 'highlight.js';

import languages from '../../doc/public/json/languages.json';

Docs = class Docs {
  constructor() {
    this.layout = 'parallel';
    this.output = 'docs';
    this.template = null;
    this.css = null;
    this.extension = null;
    this.markedOpts = null;
    this.languages(this.buildMatchers());
  }

  createDoc(options = {}, callback) {
    this.configure(options);
    return fs.mkdirs(this.output, function() {
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
        return fs.copy(file, path.join(this.output, path.basename(file)), callback);
      };
      complete = function() {
        return copyAsset(this.css, function(error) {
          if (error) {
            return callback(error);
          }
          if (fs.existsSync(this.public)) {
            return copyAsset(this.public, callback);
          }
          return callback();
        });
      };
      files = this.sources.slice();
      nextFile = function() {
        var source;
        source = files.shift();
        return fs.readFile(source, function(error, buffer) {
          var code, sections;
          if (error) {
            return callback(error);
          }
          code = buffer.toString();
          sections = parse(source, code);
          format(source, sections);
          write(source, sections);
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
  parse(source, code) {
    var codeText, docsText, hasCode, i, isText, j, k, lang, len, len1, line, lines, match, maybeCode, save, sections;
    lines = code.split('\n');
    sections = [];
    lang = getLanguage(source);
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
  format(source, sections) {
    var code, i, j, language, len, markedOpts, results, section;
    language = this.getLanguage(source);
    markedOpts = {
      smartypants: true
    };
    if (this.markedOpts) {
      markedOpts = this.markedOpts;
    }
    marked.setOptions(markedOpts);
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
  write(source, sections) {
    /*
    The **title** of the file is either the first heading in the prose, or the
    name of the source file.
    */
    var css, destination, first, firstSection, hasTitle, html, relative, title;
    destination = function(file) {
      return path.join(this.output, path.dirname(file), path.basename(file, path.extname(file)) + '.html');
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
    css = relative(path.join(this.output, path.basename(this.css)));
    html = this.template({
      sources: this.sources,
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

  /*
  Build out the appropriate matchers and delimiters for each language.
  */
  buildMatchers() {
    var ext, l, results;
    results = [];
    for (ext in languages) {
      l = languages[ext];
      l.commentMatcher = RegExp(`^\\s*${l.symbol}\\s?`);
      l.commentFilter = /(^#![\/]|^\s*#\{)/;
      results.push(languages);
    }
    return results;
  }

  /*
  A function to get the current language we're documenting, based on the
  file extension. Detect and tag "literate" `.ext.md` variants.
  */
  getLanguage(source) {
    var codeExt, codeLang, ext, lang, ref, ref1;
    ext = this.extension || path.extname(source) || path.basename(source);
    lang = ((ref = this.languages) != null ? ref[ext] : void 0) || this.languages[ext];
    if (lang && lang.name === 'markdown') {
      codeExt = path.extname(path.basename(source, ext));
      codeLang = ((ref1 = this.languages) != null ? ref1[codeExt] : void 0) || this.languages[codeExt];
      if (codeExt && codeLang) {
        lang = _.extend({}, codeLang, {
          literate: true
        });
      }
    }
    return lang;
  }

};

export default Docs;

//# sourceMappingURL=Docs.js.map
