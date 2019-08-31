var Main,
  hasProp = {}.hasOwnProperty;

import Data from '../../base/util/Data.js';

import Stream from '../../base/util/Stream.js';

import Nav from '../../base/util/NavMuse.js';

import Vis from '../../base/util/Vis.js';

import Cache from '../../base/util/Cache.js';

Main = (function() {
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.batchRead(Main.Batch, Main.init, Data.refine);
    }

    static init(batch) {
      var infoSpec, subjects;
      Main.Batch = batch; // Not necessary here, but assigned for compatibilitry
      subjects = ["Info", "Know", "Wise", "Cube", "Menu", "Page", "Nav", "Toc", "Cache"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Main.stream = new Stream(subjects, infoSpec);
      Main.nav = new Nav(Main.stream, batch, 'Info');
      //ain.cache  = new Cache( Main.stream )
      Main.mergePracsPrin();
      Main.onReady();
    }

    static mergePracsPrin() {
      var col, cols, comp, i, key, len, prcs, ref;
      cols = Main.Batch['Prin'].data['Prin'].pracs;
      ref = ['Info', 'Know', 'Wise'];
      for (i = 0, len = ref.length; i < len; i++) {
        comp = ref[i];
        prcs = Main.Batch[comp].data[comp].pracs;
        for (key in cols) {
          if (!hasProp.call(cols, key)) continue;
          col = cols[key];
          prcs[key] = col;
        }
      }
    }

    static logPracs(compk) {
      console.log('Main.pracs', Main.Batch[compk].data[compk].pracs);
    }

  };

  Main.FontUrl = "css/font/three/helvetiker_regular.typeface.json";

  Main.Batch = {
    Prin: {
      url: 'muse/Prin.json',
      data: null,
      type: 'Pack',
      plane: 'Prin'
    },
    Rows: {
      url: 'muse/Rows.json',
      data: null,
      type: 'Pack',
      plane: 'Rows'
    },
    Info: {
      url: 'muse/Info.json',
      data: null,
      type: 'Pack',
      plane: 'Info'
    },
    Know: {
      url: 'muse/Know.json',
      data: null,
      type: 'Pack',
      plane: 'Know'
    },
    Wise: {
      url: 'muse/Wise.json',
      data: null,
      type: 'Pack',
      plane: 'Wise'
    },
    Cube: {
      url: 'muse/Cube.json',
      data: null,
      type: 'Pack',
      plane: 'Cube'
    },
    Font: {
      url: Main.FontUrl,
      data: null,
      type: 'Font',
      plane: 'Cube'
    }
  };

  Main.komps = {
    Prin: {
      name: 'Prin',
      comp: 'Prin',
      pracs: {},
      ikw: true,
      link: false,
      icon: "fas fa-balance-scale"
    },
    Info: {
      name: 'Info',
      comp: 'Info',
      pracs: {},
      ikw: true,
      link: false,
      icon: "fas fa-th"
    },
    Know: {
      name: 'Know',
      comp: 'Know',
      pracs: {},
      ikw: true,
      link: false,
      icon: "fas fa-university"
    },
    Wise: {
      name: 'Wise',
      comp: 'Wise',
      pracs: {},
      ikw: true,
      link: false,
      icon: "fab fa-tripadvisor"
    },
    Cube: {
      name: 'Cube',
      comp: 'Cube',
      pracs: {},
      ikw: false,
      link: false,
      icon: "fas fa-cubes"
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
      prin: function() {
        return Main.Batch['Prin'].data['Prin'].pracs;
      },
      comps: function(compk) {
        return Main.Batch[compk].data.comps;
      },
      kompsTocs: function() { // For Tocs.vue
        return Main.komps;
      },
      views: function() {
        return ['Home', 'Cube', 'Comp', 'Prac', 'Disp', 'Conn'];
      },
      subset: function(compk, filter) {
        var filts, key, prac, ref;
        filts = {};
        ref = this.pracs(compk);
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          prac = ref[key];
          if (filter(prac)) {
            filts[key] = prac;
          }
        }
        return filts;
      },
      conns: function(compk) {
        var filter;
        filter = compk !== 'Prin' ? function(prac) {
          return prac.row !== 'Dim';
        } : function(prac) {
          return prac.row === 'Dim';
        };
        return this.subset(compk, filter);
      },
      pracs: function(compk) {
        return Main.Batch[compk].data[compk].pracs;
      },
      disps: function(compk, prack) {
        return Main.Batch[compk].data[compk][prack].disps;
      },
      areas: function(compk, prack, dispk) {
        return Main.Batch[compk].data[compk][prack][dispk].areas;
      },
      items: function(compk, prack, dispk, areak) {
        return Main.Batch[compk].data[compk][prack][dispk][areak].items;
      },
      bases: function(compk, prack, dispk, areak, itemk) {
        return Main.Batch[compk].data[compk][prack][dispk][areak][itemk].bases;
      },
      toRgbaHsv: function(hsv) {
        var hsu;
        hsu = !hsv ? [30, 90, 90] : hsv;
        return Vis.toRgbaHsv(hsu);
      }
    }
  };

  return Main;

}).call(this);

//navbSpecs:() ->
//  Main.NavbSpecs
export default Main;
