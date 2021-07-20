var UnitTester;

import {
  tester
} from './Tester.js';

import Stream from '../util/Stream.js';

UnitTester = (function() {
  // git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'
  class UnitTester {
    static start(href) {
      console.log("-- Start  --", href);
      UnitTester.href = href;
      UnitTester.init();
    }

    static init() {
      var inViteJS, paths, streamLog, subjects;
      subjects = ["TestStatus", "TestString", "TestSummary"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      UnitTester.stream = new Stream(subjects, streamLog);
      // For illustration purposes, because we are just resseting the defaults
      tester.setOptions({
        testing: true,
        archive: false,
        verbose: false,
        debug: false,
        statusSubject: "TestStatus",
        stringSubject: "TestString",
        summarySubject: "TestSummary"
      });
      tester.injectStream(UnitTester.stream);
      UnitTester.stream.subscribe('TestSummary', "Initial", (summary) => {
        return UnitTester.onSummary(summary);
      });
      inViteJS = tester.isDef(import.meta.env);
      if (inViteJS) {
        paths = tester.toKeys(import.meta.glob("/lib/**/*-unit.js"));
        paths.concat(tester.toKeys(import.meta.glob("/pub/**/*-unit.js")));
      } else {
        paths = ["/lib/pub/test/Type-unit.js", "/lib/pub/util/Stream-unit.js", "/lib/pub/test/Spec-unit.js", "/lib/pub/test/Tester-unit.js", "/lib/pub/draw/Vis-unit.js"];
      }
      // paths = ["/lib/pub/test/Type-unit.js"]
      tester.runUnitTests(paths);
    }

    static onSummary(summary) {
      var div, i, len, line, lines, sum;
      // console.log( "Initial.onSummary(summary)", summary )
      sum = document.getElementById('summary');
      sum.stype = "";
      lines = summary.split("\n");
      for (i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        div = document.createElement('div');
        div.style = "font-size:3vmin; text-align:left; white-space:pre;";
        div.append(line);
        sum.append(div);
      }
      div = document.createElement('div');
      div.append("  ");
      div.style = "font-size:3vmin; text-align:left; white-space:pre;";
      sum.append(div);
    }

  };

  UnitTester.appName = 'Initial';

  UnitTester.debug = false;

  return UnitTester;

}).call(this);

export default UnitTester;

//# sourceMappingURL=UnitTester.js.map
