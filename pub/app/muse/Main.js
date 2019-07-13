var Main,
  hasProp = {}.hasOwnProperty;

import Data from '../../base/util/Data.js';

import Stream from '../../base/util/Stream.js';

import Vis from '../../base/util/Vis.js';

Main = (function() {
  //mport Cache   from '../../base/util/Cache.js'
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.batchRead(Main.Batch, Main.init, Data.refine);
    }

    static init(batch) {
      var infoSpec, subjects;
      Main.Batch = batch; // Not necessary here, but assigned for compatibilitry
      subjects = ["Info", "Know", "Wise", "Cube", "Navb", "Tabs", "Cache"];
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Main.stream = new Stream(subjects, infoSpec);
      //ain.cache  = new Cache( Main.stream )
      Main.mergePracsCols();
      Main.onReady();
    }

    static mergePracsCols() {
      var col, cols, comp, i, key, len, prcs, ref;
      cols = Main.Batch['Cols'].data['Cols'].pracs;
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

  Data.local = "../data/";

  Data.hosted = "https://augm-d4b3c.firebaseapp.com/app/data/";

  Main.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json";

  Main.Batch = {
    Cols: {
      url: 'muse/Cols.json',
      data: null,
      type: 'Pack',
      plane: 'Cols'
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
      cols: function() {
        return Main.Batch['Cols'].data['Cols'].pracs;
      },
      comps: function(compk) {
        return Main.Batch[compk].data.comps;
      },
      kompsTocs: function() { // For Tocs.vue
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
      conns: function(compk) {
        return this.subset(compk, function(prac) {
          return prac.row !== 'Dim';
        });
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
        return Vis.toRgbaHsv(hsv);
      }
    }
  };

  return Main;

}).call(this);

//navbSpecs:() ->
//  Main.NavbSpecs
export default Main;
