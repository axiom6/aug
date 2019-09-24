var Mixin,
  hasProp = {}.hasOwnProperty;

import Vis from '../util/Vis.js';

Mixin = class Mixin {
  // Muse   ['Home','Prin','Comp','Prac','Disp','Cube']
  // Augn   ['Home','Math','Geom','Data','Draw','Note','Wood' ]
  // Jitter ['Home','Flavor','Roast','Brew','Drink','Body']
  constructor(Main, views) {
    Mixin.Main = Main;
    Mixin.views = views;
  }

  mixin() {
    return {
      created: function() {},
      // console.log( 'Main.vueMixin.created() globally' )
      methods: {
        isDef: function(d) {
          return d !== null && typeof d !== 'undefined';
        },
        isStr: function(s) {
          return this.isDef(s) && typeof s === "string" && s.length > 0;
        },
        isArray: function(a) {
          return this.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
        },
        inArray: function(e, a) {
          return this.isArray(a) && a.indexOf(e) > -1;
        },
        app: function() {
          return Mixin.Main.app;
        },
        subscribe: function(subject, source, onMethod) {
          Mixin.Main['stream'].subscribe(subject, source, onMethod);
        },
        publish: function(subject, object) {
          Mixin.Main['stream'].publish(subject, object);
        },
        stream: function() {
          return Mixin.Main.stream;
        },
        batch: function() {
          return Mixin.Main.Batch;
        },
        nav: function() {
          if (Mixin.Main.nav == null) {
            console.error('Mixin.nav() null');
          }
          return Mixin.Main.nav;
        },
        dir: function() {
          if (Mixin.Main.dir == null) {
            console.error('Mixin.dir() null');
          }
          return Mixin.Main.dir;
        },
        isDir: function() {
          return Mixin.Main.dir != null;
        },
        isNav: function() {
          return Mixin.Main.nav != null;
        },
        isRoute: function(route) {
          if (this.isNav()) {
            return route === this.nav().route;
          } else if (this.isDir()) {
            return route === this.dir().route;
          } else {
            return false;
          }
        },
        keys: function(obj) {
          return Object.keys(obj);
        },
        prin: function() {
          return Mixin.Main.Batch['Prin'].data.pracs;
        },
        comps: function(compk) {
          return Mixin.Main.Batch[compk].data.comps;
        },
        kompsTocs: function() { // For Tocs.vue
          return Mixin.Main.komps;
        },
        views: function() {
          return Mixin.views;
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
          return Mixin.Main.Batch[compk].data.pracs;
        },
        disps: function(compk, prack) {
          return Mixin.Main.Batch[compk].data[prack].disps;
        },
        areas: function(compk, prack, dispk) {
          return Mixin.Main.Batch[compk].data[prack][dispk].areas;
        },
        items: function(compk, prack, dispk, areak) {
          return Mixin.Main.Batch[compk].data[prack][dispk][areak].items;
        },
        bases: function(compk, prack, dispk, areak, itemk) {
          return Mixin.Main.Batch[compk].data[prack][dispk][areak][itemk].bases;
        },
        compObject: function(compKey) {
          return Mixin.Main.Batch[compKey].data.pracs;
        },
        pracObject: function(compKey, pracKey) {
          return this.pracs(compKey)[pracKey];
        },
        dispObject: function(compKey, pracKey, dispKey) {
          return this.disps(compKey, pracKey)[dispKey];
        },
        toRgbaHsv: function(hsv) {
          var hsu;
          hsu = !hsv ? [30, 90, 90] : hsv;
          return Vis.toRgbaHsv(hsu);
        },
        showPages: function(pages, pageKey) {
          var hasPage, key, page;
          hasPage = false;
          for (key in pages) {
            if (!hasProp.call(pages, key)) continue;
            page = pages[key];
            page.show = key === pageKey;
            if (page.show) {
              hasPage = true;
            }
          }
          // console.log( 'Main.showPages()', { pageKey:pageKey, hasPage:hasPage, pages:pages })
          return hasPage;
        },
        choice: function() {
          return Mixin.Main.Batch.Choice.data;
        },
        choices: function(name) {
          var obj;
          obj = this.choice()[name];
          if (obj != null) {
            return obj.choices;
          } else {
            console.error('Mixin.choices() bad choice name', {
              name: name
            });
            return [];
          }
        },
        choose: function(name, choice) {
          var obj;
          obj = this.choice()[name];
          if (obj != null) {
            obj.choices[obj.idx] = choice;
            obj.idx = ++obj.idx % obj.choices.length;
          } else {
            console.error('Mixin.choose() bad choice', {
              name: name,
              choice: choice
            });
          }
        },
        choosen: function(name, choice) {
          return (this.choice()[name] != null) && this.inArray(choice, this.choices(name));
        },
        choiceIndex: function(name, choice) {
          var idx, obj;
          obj = this.choice()[name];
          idx = 0;
          if (obj != null) {
            idx = obj.choices.indexOf(choice);
            idx = idx === -1 ? 0 : idx;
          } else {
            console.error('Mixin.choiceIndex() bad choice name', {
              name: name,
              idx: idx
            });
          }
          return idx;
        }
      }
    };
  }

};

export default Mixin;
