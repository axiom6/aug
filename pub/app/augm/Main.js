var Main,
  hasProp = {}.hasOwnProperty;

import Data from '../../bas/util/Data.js';

import Stream from '../../bas/util/Stream.js';

import Vis from '../../bas/util/Vis.js';

Main = (function() {
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.batchRead(Main.Batch, Main.init, Data.refine);
    }

    static init(batch) {
      var streamLog, subjects;
      window['Geom'] = {};
      Main.Batch = batch; // Not necessary here, but assigned for compatibilitry
      subjects = ["Draw", "Note", "Navb", "Tabs", "Geom"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Main.stream = new Stream(subjects, streamLog);
      Main.onReady();
    }

  };

  Data.local = "app/data/";

  Data.hosted = "https://ui-48413.firebaseapp.com/";

  Main.FontUrl = "css/font/three/helvetiker_regular.typeface.json";

  Main.Batch = {
    Math: {
      url: 'augm/Math.json',
      data: null,
      type: 'Pack',
      plane: 'Math'
    },
    Geom: {
      url: 'augm/Geom.json',
      data: null,
      type: 'Pack',
      plane: 'Geom'
    },
    Data: {
      url: 'augm/Data.json',
      data: null,
      type: 'Pack',
      plane: 'Data'
    }
  };

  Main.komps = {
    Math: {
      name: 'Math',
      comp: 'Math',
      pracs: {},
      ikw: true,
      link: true,
      icon: "fas fa-bezier-curve"
    },
    Geom: {
      name: 'Geom',
      comp: 'Geom',
      pracs: {},
      ikw: true,
      link: true,
      icon: "fas fa-shapes"
    },
    Data: {
      name: 'Data',
      comp: 'Data',
      pracs: {},
      ikw: true,
      link: true,
      icon: "fas fa-database"
    },
    Note: {
      name: 'Note',
      comp: 'Note',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fab fa-leanpub"
    },
    Draw: {
      name: 'Draw',
      comp: 'Draw',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fas fa-draw-polygon"
    },
    Wood: {
      name: 'Wood',
      comp: 'Wood',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fas fa-tree"
    }
  };

  Main.vueMixin = {
    created: function() {},
    // console.log( 'Main.vueMixin.created() globally' )
    methods: {
      isDef: function(d) {
        return d !== null && typeof d !== 'undefined';
      },
      subscribe: function(subject, source, onMethod) {
        Main['stream'].subscribe(subject, source, onMethod);
      },
      publish: function(subject, object) {
        Main['stream'].publish(subject, object);
      },
      stream: function() {
        return Main.stream;
      },
      batch: function() {
        return Main.Batch;
      },
      keys: function(obj) {
        return Object.keys(obj);
      },
      comps: function(compk) {
        return Main.Batch[compk].data.comps;
      },
      kompsTocs: function() {
        return Main.komps;
      },
      pracs: function(compk) {
        return Main.Batch[compk].data[compk].pracs;
      },
      subset: function(compk, filter) {
        var filts, key, prac, ref;
        filts = {};
        ref = Main.Batch[compk].data[compk].pracs;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          prac = ref[key];
          if (filter(prac)) {
            filts[key] = prac;
          }
        }
        return filts;
      },
      toRgbaHsv: function(hsv) {
        return Vis.toRgbaHsv(hsv);
      }
    }
  };

  return Main;

}).call(this);

export default Main;
