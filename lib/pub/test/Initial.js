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
      var inViteJS, modulesLib, modulesPub, paths, streamLog, subjects;
      subjects = ["TestStatus", "TestString", "TestSummary"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Initial.stream = new Stream(subjects, streamLog);
      // For illustration purposes, because we are just resseting the defaults
      tester.setOptions({
        testing: true,
        archive: true,
        verbose: false,
        debug: false,
        statusSubject: "TestStatus",
        stringSubject: "TestString",
        summarySubject: "TestSummary"
      });
      tester.injectStream(Initial.stream);
      Initial.stream.subscribe('TestSummary', "Initial", (summary) => {
        return Initial.onSummary(summary);
      });
      inViteJS = tester.isDef(import.meta.env);
      if (inViteJS) {
        modulesLib = import.meta.glob("/lib/**/*-unit.js");
        modulesPub = import.meta.glob("/pub/**/*-unit.js");
        Initial.total = tester.toKeys(modulesLib).length + tester.toKeys(modulesPub).length;
        Initial.count = 0;
        Initial.summaryPublished = false;
        Initial.runUnitTestsViteJS(modulesLib);
        Initial.runUnitTestsViteJS(modulesPub);
      } else {
        paths = ["/lib/pub/base/util/Stream-unit.js", "/lib/pub/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"];
        tester.runUnitTests(paths);
      }
    }

    static runUnitTestsViteJS(modules) {
      var importer, path, results;
      if (this.debug) {
        console.log("Tester.runUnitTestsViteJS()", {
          modules: modules,
          glob: "/lib/**/*-unit.js"
        });
      }
      results = [];
      for (path in modules) {
        if (!hasProp.call(modules, path)) continue;
        importer = modules[path];
        results.push(modules[path]().then(async(importer) => {
          if (this.debug) {
            console.log(path, importer);
          }
          await importer;
          Initial.count++;
          if (Initial.count === Initial.total && !Initial.summaryPublished) {
            Initial.summaryPublished = true;
            Initial.stream.publish("TestSummay", tester.summary());
            tester.log(tester.summary());
          }
        }));
      }
      return results;
    }

    static onSummary(summary) {
      var div, i, len, line, lines, sum;
      // console.log( "Initial.onSummary(summary)", summary )
      sum = document.getElementById('summary');
      lines = summary.split("\n");
      for (i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        div = document.createElement('div');
        div.style = "font-size:3vmin;";
        div.append(line);
        sum.append(div);
      }
    }

  };

  Initial.appName = 'Initial';

  Initial.debug = false;

  return Initial;

}).call(this);

export default Initial;

//# sourceMappingURL=Initial.js.map
