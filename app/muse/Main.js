var Main,
  hasProp = {}.hasOwnProperty;

import Util from '../../pub/util/Util.js';

import Data from '../../pub/util/Data.js';

import Stream from '../../pub/util/Stream.js';

import Vis from '../../pub/util/Vis.js';

Main = (function() {
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.batchRead(Main.Batch, Main.init, Data.refine);
    }

    static init(batch) {
      var infoSpec, subjects;
      Main.Batch = batch; // Not necessary here, but assigned for compatibilitry
      subjects = ["Info", "Know", "Wise"];
      subjects = subjects.concat(Main.NavbSubjects);
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: subjects
      };
      Main.stream = new Stream(subjects, infoSpec);
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

  Data.local = "http://localhost:63342/aug/app/data/";

  Data.hosted = "https://ui-48413.firebaseapp.com/";

  Main.FontUrl = "../../css/font/helvetiker_regular.typeface.json";

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
      type: 'Spec',
      plane: 'Cube'
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
      batch: function() {
        return Main.Batch;
      },
      cols: function() {
        console.log('Cols', Main.Batch['Cols'].data['Cols'].pracs);
        return Main.Batch['Cols'].data['Cols'].pracs;
      },
      comps: function(compk) {
        return Main.Batch[compk].data.comps;
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
        return Vis.toRgbaHsv(hsv);
      }
    }
  };

  Main.NavbSubjects = ["Search", "Contact", "Settings", "SignOn"];

  Main.NavbSpecs = [
    {
      type: "NavBarLeft"
    },
    {
      type: "Item",
      name: "Home",
      icon: "fa-home",
      topic: 'SelectView',
      subject: "Select"
    },
    {
      type: "NavBarEnd"
    },
    {
      type: "NavBarRight"
    },
    {
      type: "Search",
      name: "Search",
      icon: "fa-search",
      size: "10",
      topic: 'Search',
      subject: "Search"
    },
    {
      type: "Contact",
      name: "Contact",
      icon: "fa-user",
      topic: "http://twitter.com/TheTomFlaherty",
      subject: "Contact"
    },
    {
      type: "Dropdown",
      name: "Settings",
      icon: "fa-cog",
      items: [
        {
          type: "Item",
          name: "Preferences",
          topic: "Preferences",
          subject: "Settings"
        },
        {
          type: "Item",
          name: "Connection",
          topic: "Connection",
          subject: "Settings"
        },
        {
          type: "Item",
          name: "Privacy",
          topic: "Privacy",
          subject: "Settings"
        }
      ]
    },
    {
      type: "SignOn",
      name: "SignOn",
      icon: "fa-sign-in",
      size: "10",
      topic: 'SignOn',
      subject: "SignOn"
    },
    {
      type: "NavBarEnd"
    }
  ];

  Util.noop(Main.NavbSpecs);

  return Main;

}).call(this);

export default Main;
