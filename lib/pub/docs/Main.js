var Main;

import Docs from "./Docs.js";

import commander from 'commander';

Main = class Main {
  static run(args = process.argv) {
    var docs, version;
    version = "1.0.0";
    docs = new Docs();
    commander.version(version).usage('[options] files').option('-L, --languages [file]', 'use a custom languages.json', _.compose(JSON.parse, fs.readFileSync)).option('-l, --layout [name]', 'choose a layout (parallel, linear or classic)', docs.layout).option('-o, --output [path]', 'output to a given folder', docs.output).option('-c, --css [file]', 'use a custom css file', docs.css).option('-t, --template [file]', 'use a custom .jst template', docs.template).option('-e, --extension [ext]', 'assume a file extension for all inputs', docs.extension).option('-m, --marked [file]', 'use custom marked options', docs.marked).parse(args).name = "docs";
    if (commander.args.length) {
      docs.createDoc();
    } else {
      console.log(commander.helpInformation());
    }
    return Main.docs = docs;
  }

  static configure(options) {
    var config, dir, docs;
    docs = Main.docs;
    config = _.extend({}, this.defaults(), _.pick(options.opts(), ..._.keys(this.defaults())));
    docs.languages = this.buildMatchers(docs.languages);
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
      docs.layout = null;
    } else {
      dir = this.layout = path.join(__dirname, 'resources', this.layout);
      docs.public = path.join(dir, fs.existsSync(path.join(dir, 'public')) ? 'public' : void 0);
      docs.template = path.join(dir, 'docco.jst');
      docs.css = options.css || path.join(dir, 'docco.css');
    }
    docs.template = _.template(fs.readFileSync(docs.template).toString());
    if (options.markedOpts) {
      docs.markedOpts = JSON.parse(fs.readFileSync(options.markedOpts));
    }
    docs.sources = options.args.filter(function(source) {
      var lang;
      lang = this.getLanguage(source);
      if (!lang) {
        console.warn(`docco: skipped unknown type (${path.basename(source)})`);
      }
      return lang;
    }).sort();
  }

};

//# sourceMappingURL=Main.js.map
