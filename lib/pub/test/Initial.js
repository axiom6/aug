var Initial,
  hasProp = {}.hasOwnProperty;

import {
  tester
} from './Tester.js';

import Stream from '../base/util/Stream.js';

Initial = (function() {
  // git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'
  class Initial {
    static start(href) {
      console.log("Initial.start()", href);
      Initial.href = href;
      Initial.init();
    }

    static init() {
      var inViteJS, paths, streamLog, subjects;
      subjects = ["Nav", "Test"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Initial.stream = new Stream(subjects, streamLog);
      // Tester exports { test, unit, tester }
      tester.setOptions({
        testing: true,
        logToConsoie: true,
        archive: true,
        verbose: false,
        debug: false
      });
      tester.injectStream(Initial.stream);
      inViteJS = tester.isDef(import.meta.env);
      if (inViteJS) {
        Initial.runUnitTestsViteJS(); // Can't pass glob pattern "/pub/**/*-unit.js"
      } else {
        paths = ["/lib/pub/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"];
        tester.runUnitTests(paths);
      }
    }

    static runUnitTestsViteJS() {
      var count, globPtn, importer, modules, path, results, total;
      globPtn = "/lib/**/*-unit.js";
      modules = import.meta.glob("/lib/**/*-unit.js"); // vite.js dependent with nack tics for non standard import
      if (this.debug) {
        console.log("Tester.runUnitTestsViteJS()", modules, globPtn);
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
            tester.log(tester.summary());
          }
        }));
      }
      return results;
    }

  };

  Initial.appName = 'Initial';

  Initial.debug = false;

  return Initial;

}).call(this);

export default Initial;

//# sourceMappingURL=Initial.js.map
