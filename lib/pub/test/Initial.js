var Initial;

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
      var paths, streamLog, subjects;
      subjects = ["Nav", "Test"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Initial.stream = new Stream(subjects, streamLog);
      // Tester does the { test, unit, log, tester } exports
      tester.setOptions({
        testing: true,
        logToConsoie: true,
        archive: true,
        verbose: false,
        debug: false
      });
      tester.injectStream(Initial.stream);
      paths = ["/lib/pub/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"];
      tester.runUnitTestModulesFromPaths(paths);
    }

  };

  Initial.appName = 'Initial';

  Initial.debug = true;

  return Initial;

}).call(this);

/*
if tester.inViteJS                       # Can't pass glob pattern "/pub/xx/x-unit.js" i.e.   into
   tester.runUnitTestModulesWithViteJS() #  the ViteJS import.meta.glob()
else
   tester.runUnitTestModulesFromPaths( ["/lib/pub/base/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"] )
*/
export default Initial;

//# sourceMappingURL=Initial.js.map
