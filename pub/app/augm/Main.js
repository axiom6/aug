var Main,
  hasProp = {}.hasOwnProperty;

import Data from '../../base/util/Data.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/util/Nav.js';

import Vis from '../../base/util/Vis.js';

import Cache from '../../base/util/Cache.js';

Main = (function() {
  //mport Test   from './Test.js'
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.batchRead(Main.Batch, Main.init, Data.refine);
    }

    static init(batch) {
      var streamLog, subjects;
      window['Geom'] = {};
      Main.Batch = batch; // Not necessary here, but assigned for compatibilitry
      subjects = ["Draw", "Note", "Menu", "Tabs", "Geom", "Data", "Cache", "Navd"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Main.stream = new Stream(subjects, streamLog);
      Main.nav = new Nav(Main.stream, batch, 'Info');
      //ain.cache  = new Cache( Main.stream )
      Main.onReady();
    }

  };

  //ata.local   = "app/data/"
  //ata.hosted  = "https://augm-d4b3c.firebaseapp.com/app/data/"
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
      title: 'Math',
      key: 'Math',
      route: 'Math',
      pracs: {},
      ikw: true,
      link: true,
      icon: "fas fa-bezier-curve"
    },
    Geom: {
      title: 'Geom',
      key: 'Geom',
      route: 'Geom',
      pracs: {},
      ikw: true,
      link: true,
      icon: "fas fa-shapes"
    },
    Data: {
      title: 'Data',
      key: 'Data',
      route: 'Data',
      pracs: {},
      ikw: true,
      link: true,
      icon: "fas fa-database"
    },
    Note: {
      title: 'Note',
      key: 'Note',
      route: 'Note',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fab fa-leanpub"
    },
    Draw: {
      title: 'Draw',
      key: 'Draw',
      route: 'Draw',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fas fa-draw-polygon"
    },
    Wood: {
      title: 'Wood',
      key: 'Wood',
      route: 'Wood',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fas fa-tree"
    }
  };

  // new Test()
  Main.vueMixin = {
    created: function() {},
    // console.log( 'Main.vueMixin.created() globally' )
    methods: {
      isDef: function(d) {
        return d !== null && typeof d !== 'undefined';
      },
      isStr: function(s) {
        return this.isDef(s) && typeof s === "string" && s.length > 0;
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
      nav: function() {
        return Main.nav;
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
      views: function() {
        return ['Home', 'Math', 'Geom', 'Data', 'Draw', 'Note', 'Wood'];
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
