var Main,
  hasProp = {}.hasOwnProperty;

import Data from '../../base/util/Data.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/util/Nav.js';

import Vis from '../../base/util/Vis.js';

Main = (function() {
  //mport Cache  from '../../base/util/Cache.js'
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.batchRead(Main.Batch, Main.init, Data.refine);
    }

    static init(batch) {
      var streamLog, subjects;
      Main.Batch = batch; // Not necessary here, but assigned for compatibilitry
      subjects = ["Nav"];
      streamLog = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Main.stream = new Stream(subjects, streamLog);
      Main.nav = new Nav(Main.stream, Main.Batch.Navs.data, 'Home');
      //ain.cache   = new Cache( Main.stream )
      Main.onReady();
    }

  };

  Main.Batch = {
    Choice: {
      url: 'jitter/Choice.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Navs: {
      url: 'jitter/Navs.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Jitter: {
      url: 'jitter/Jitter.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Flavor: {
      url: 'jitter/Flavor.json',
      data: null,
      type: 'None',
      plane: 'None'
    },
    Region: {
      url: 'jitter/Region.json',
      data: null,
      type: 'None',
      plane: 'None'
    }
  };

  Main.komps = { // Used by Tocs.vue with desk top apps
    Home: {
      name: 'Home',
      comp: 'Home',
      icon: "fas fa-draw-polygon"
    },
    Flavor: {
      name: 'Flavor',
      comp: 'Flavor',
      icon: "fas fa-bezier-curve"
    },
    Roast: {
      name: 'Roast',
      comp: 'Roast',
      icon: "fas fa-bezier-curve"
    },
    Brew: {
      name: 'Brew',
      comp: 'Brew',
      icon: "fas fa-bezier-curve"
    },
    Drink: {
      name: 'Drink',
      comp: 'Drink',
      icon: "fas fa-bezier-curve"
    },
    Body: {
      name: 'Body',
      comp: 'Body',
      icon: "fas fa-bezier-curve"
    }
  };

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
        return ['Home', 'Flavor', 'Roast', 'Brew', 'Drink', 'Body'];
      },
      choice: function() {
        return Main.Batch.Choice.data;
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
