var Module,
  hasProp = {}.hasOwnProperty;

import {
  test
} from './Tester.js';

Module = class Module {
  constructor() {
    this.doModules = this.doModules.bind(this);
    this.debug = false;
  }

  doModules() {
    var count, globPtn, importer, modules, path, results, total;
    globPtn = "/pub/**/*-unit.js";
    modules = import.meta.glob("/pub/**/*-unit.js"); // Back tics for non standard import
    if (this.debug) {
      console.log("TesterMods modules", modules, globPtn);
    }
    count = 0;
    total = Object.keys(modules).length;
    results = [];
    for (path in modules) {
      if (!hasProp.call(modules, path)) continue;
      importer = modules[path];
      results.push(modules[path]().then(async(importer) => {
        if (this.debug) {
          console.log(path, importer);
        }
        await importer;
        count++;
        if (count === total) {
          test().summary();
        }
      }));
    }
    return results;
  }

};

export default Module;
