var Mixin,
  hasProp = {}.hasOwnProperty;

import Vis from '../../draw/base/Vis.js';

Mixin = class Mixin {
  constructor(Main, views) {
    Mixin.Main = Main;
    Mixin.views = views;
  }

  mixin() {
    return {
      created: function() {},
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
        isChild: function(key) {
          var a, b;
          a = key.charAt(0);
          b = key.charAt(key.length - 1);
          return a === a.toUpperCase() && a !== '$' && b !== '_';
        },
        app: function() {
          return Mixin.Main.app;
        },
        isMuse: function() {
          return 'Muse' === this.app();
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
        navRoute: function() {
          if (this.isNav()) {
            return this.nav().route;
          } else if (this.isDir()) {
            return this.dir().route;
          } else {
            return 'None';
          }
        },
        isRoute: function(route) {
          return route === this.navRoute();
        },
        keys: function(obj) {
          return Object.keys(obj);
        },
        fontSize: function(scale) { // JavaScript font-size the matches themeFS in theme.less
          var fs, sc;
          fs = Mixin.Main.fontSize != null ? Mixin.Main.fontSize : 2;
          sc = scale != null ? scale : 1;
          return sc * fs + 'vmin';
        },
        fontSizeCss: function(scale) {
          return {
            fontSize: this.fontSize(scale)
          };
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
          if (Mixin.Main.Batch[compKey] != null) {
            return Mixin.Main.Batch[compKey].data.pracs;
          } else {
            console.error('Mixin.compObject() bad compKey', compKey);
            return {};
          }
        },
        pracObject: function(compKey, pracKey) {
          var prac;
          prac = {};
          if (this.pracs(compKey) != null) {
            if (this.pracs(compKey)[pracKey] != null) {
              prac = this.pracs(compKey)[pracKey];
            } else {
              console.error('Mixin.pracObj() unknown pracKey', {
                compKey: compKey,
                pracKey: pracKey
              });
            }
          } else {
            console.error('Mixin.pracObj() unknown compKey', {
              compKey: compKey,
              pracKey: pracKey
            });
          }
          return prac;
        },
        dispObject: function(compKey, pracKey, dispKey) {
          return this.disps(compKey, pracKey)[dispKey];
        },
        isPageKeyComp: function(pageKey) {
          return pageKey === 'Info' || pageKey === 'Data'; // this.app() is 'Muse' and
        },
        styleObj: function(ikwObj, fontSize = void 0) {
          var hsv, style;
          hsv = [30, 90, 90];
          if (this.isDef(ikwObj)) {
            if (this.isDef(ikwObj.hsv)) {
              hsv = ikwObj.hsv;
            } else if (this.isDef(ikwObj.dir)) {
              hsv = (function() {
                switch (ikwObj.dir) {
                  case 'west':
                    return [195, 90, 70];
                  case 'north':
                    return [90, 90, 90];
                  case 'east':
                    return [30, 60, 90];
                  case 'south':
                    return [60, 90, 90];
                  default:
                    return [30, 90, 90];
                }
              })();
            }
          }
          style = {
            backgroundColor: Vis.toRgbaHsv(hsv)
          };
          if (fontSize) {
            style['fontSize'] = fontSize + 'rem';
          }
          return style;
        },
        toRgbaHsv: function(hsv) {
          return Vis.toRgbaHsv(hsv);
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
        },
        hasElem: function(elem) {
          return (elem != null) && (elem['clientHeight'] != null) && elem['clientHeight'] > 0;
        },
        // Not called
        getElem: function($refs, name) {
          var elem;
          elem = $refs[name];
          console.log('Mixin.getElem() $refs[name]   ', $refs, elem, name);
          if (!this.hasElem(elem) && (elem[0] != null)) {
            elem = $refs[name][0];
            console.log('Mixin.getElem() $refs[name][0]', $refs, elem, name);
            if (!this.hasElem(elem)) {
              console.error('Mixin.hasElem() unable to find elem in $refs[name]', name);
              console.dir($refs);
              elem = null;
            }
          } else {
            console.error('Mixin.hasElem() unable to find elem in $refs[name][0]', name);
            elem = null;
          }
          return elem;
        }
      }
    };
  }

};

export default Mixin;
