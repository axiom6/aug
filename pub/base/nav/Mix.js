var Mix,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Vis from '../../base/draw/Vis.js';

Mix = class Mix {
  constructor(Main) {
    Mix.Main = Main;
    this.debug = false;
  }

  // Util
  isDef(d) {
    return d !== null && typeof d !== 'undefined' && d !== 'None';
  }

  isStr(s) {
    return this.isDef(s) && typeof s === "string" && s.length > 0;
  }

  isFunc(f) {
    return this.isDef(f) && typeof f === "function";
  }

  isArray(a) {
    return this.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  inArray(e, a) {
    return this.isArray(a) && a.indexOf(e) > -1;
  }

  inObject(name, obj) {
    var key, val;
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (key === name) {
        return true;
      }
    }
    return false;
  }

  isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== '$' && b !== '_';
  }

  keys(obj) {
    return Object.keys(obj);
  }

  hasElem(elem) {
    return (elem != null) && (elem['clientHeight'] != null) && elem['clientHeight'] > 0;
  }

  getElem($refs, name) { // Not called
    var elem;
    elem = $refs[name];
    console.log('Mix.getElem() $refs[name]   ', $refs, elem, name);
    if (!this.hasElem(elem) && (elem[0] != null)) {
      elem = $refs[name][0];
      console.log('Mix.getElem() $refs[name][0]', $refs, elem, name);
      if (!this.hasElem(elem)) {
        console.error('Mix.hasElem() unable to find elem in $refs[name]', name);
        console.dir($refs);
        elem = null;
      }
    } else {
      console.error('Mix.hasElem() unable to find elem in $refs[name][0]', name);
      elem = null;
    }
    return elem;
  }

  styleObj(ikwObj, fontSize = void 0) {
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
  }

  toRgbaHsv(hsv) {
    return Vis.toRgbaHsv(hsv);
  }

  // Main
  app() {
    return Mix.Main.myName;
  }

  isMuse() {
    return 'Muse' === this.app();
  }

  subscribe(subject, source, onMethod) {
    Mix.Main['stream'].subscribe(subject, source, onMethod);
  }

  publish(subject, object) {
    Mix.Main['stream'].publish(subject, object);
  }

  stream() {
    return Mix.Main.stream;
  }

  batch() {
    return Mix.Main.Batch;
  }

  fontSize(scale) { // JavaScript font-size the matches themeFS in theme.less
    var fs, sc;
    fs = Mix.Main.fontSize != null ? Mix.Main.fontSize : 2;
    sc = scale != null ? scale : 1;
    return sc * fs + 'vmin';
  }

  fontSizeCss(scale) {
    return {
      fontSize: this.fontSize(scale)
    };
  }

  addScript(src) {
    var i, len, script, scripts, scriptx;
    scripts = document.getElementsByTagName('script');
    for (i = 0, len = scripts.length; i < len; i++) {
      scriptx = scripts[i];
      // console.log( 'Mix.addScript() scriptx src', scriptx.src )
      if (scriptx.src.includes(src)) {
        return;
      }
    }
    // console.log( 'Mix.addScript() adding', src )
    script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // Nav
  nav() {
    if (Mix.Main.nav == null) {
      console.error('Mix.nav() null');
    }
    return Mix.Main.nav;
  }

  touch() {
    if (Mix.Main.touch == null) {
      console.error('Mix.touch() null');
    }
    return Mix.Main.touch;
  }

  isNav() {
    return Mix.Main.nav != null;
  }

  navRoute() {
    if (this.isNav()) {
      return this.nav().route;
    } else if (this.isDir()) {
      return this.dir().route;
    } else {
      return 'None';
    }
  }

  isRoute(route) {
    return route === this.navRoute();
  }

  // Batch
  isBatch(compk) {
    return Mix.Main.Batch[compk] != null;
  }

  data(name) {
    if (this.isBatch(name)) {
      return Mix.Main.Batch[name].data;
    } else {
      console.error('Mix.data() unknown data name', name);
      return {};
    }
  }

  prin() {
    return Mix.Main.Batch['Prin'].data.pracs;
  }

  comps(compk) {
    return Mix.Main.Batch[compk].data.comps;
  }

  kompsTocs() { // For Tocs.vue
    return Mix.Main.komps;
  }

  subset(compk, filter) {
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
  }

  conns(compk) {
    var filter;
    filter = compk !== 'Prin' ? function(prac) {
      return prac.row !== 'Dim';
    } : function(prac) {
      return prac.row === 'Dim';
    };
    return this.subset(compk, filter);
  }

  pracs(compk) {
    return Mix.Main.Batch[compk].data.pracs;
  }

  disps(compk, prack) {
    return Mix.Main.Batch[compk].data[prack].disps;
  }

  areas(compk, prack, dispk) {
    return Mix.Main.Batch[compk].data[prack][dispk].areas;
  }

  items(compk, prack, dispk, areak) {
    return Mix.Main.Batch[compk].data[prack][dispk][areak].items;
  }

  bases(compk, prack, dispk, areak, itemk) {
    return Mix.Main.Batch[compk].data[prack][dispk][areak][itemk].bases;
  }

  compObject(compKey) {
    var obj;
    obj = {};
    if (Mix.Main.Batch[compKey] != null) {
      obj = Mix.Main.Batch[compKey].data.pracs;
    } else if (compKey !== 'Home' && compKey !== 'Defs') {
      console.error('Mix.compObject() bad compKey', compKey);
    }
    return obj;
  }

  inovObject(compKey, inovKey) {
    var compPracs, inovPrac, inovPracs, key, prac, pracs;
    pracs = {};
    if (this.isBatch(compKey)) {
      compPracs = this.pracs(compKey);
      if (this.isDef(inovKey) && inovKey !== compKey && this.isBatch(inovKey)) {
        inovPracs = this.pracs(inovKey);
        if (this.debug) {
          console.log('Mix.inovObject() inovPracs', {
            inovKey: inovKey,
            inovPracs: inovPracs
          });
        }
        for (key in compPracs) {
          prac = compPracs[key];
          if (prac.column === 'Innovate' && prac.row !== 'Dim') {
            inovPrac = this.getPrac(inovPracs, prac.row, prac.column, inovKey);
            pracs[inovPrac.name] = inovPrac;
          } else {
            pracs[key] = prac;
          }
        }
      } else {
        pracs = compPracs;
      }
    } else if (compKey !== "Home" && compKey !== "Cube") {
      console.error('Mix.inovObject() bad compKey or inovKey', {
        compKey: compKey,
        inovKey: inovKey
      });
    }
    return pracs;
  }

  pracObject(compKey, inovKey, pracKey) {
    var prac, pracs;
    pracs = this.inovObject(compKey, inovKey);
    prac = {};
    if (pracs[pracKey] != null) {
      prac = pracs[pracKey];
    } else {
      console.error('Mix.pracObject() unknown pracKey', {
        compKey: compKey,
        inovKey: inovKey,
        pracKey: pracKey,
        pracs: pracs
      });
    }
    return prac;
  }

  sectObject(pracKey, dispKey) {
    var sectObj, sectObjs, talkObj, talkObjs;
    talkObjs = this.compObject('Talk');
    talkObj = talkObjs[pracKey];
    console.log('Mix.sectObj()', {
      talkObj: talkObj,
      talkKey: pracKey,
      sectKey: dispKey // , sectObj:sectObj
    });
    sectObjs = this.compObject(talkObj.comp);
    talkObj.keys = talkObj.keys != null ? talkObj.keys : Util.childKeys(sectObjs);
    dispKey = dispKey === 'None' || !this.inArray(dispKey, talkObj.keys) ? this.keys(sectObjs)[0] : dispKey;
    sectObj = sectObjs[dispKey];
    if (sectObj == null) {
      console.error('Nav.sectObject null', {
        pracKey: pracKey,
        dispKey: dispKey
      });
      sectObj = {};
    }
    sectObj.src = talkObj.src;
    sectObj.name = dispKey;
    sectObj.peys = talkObj.keys;
    sectObj.keys = sectObj.keys != null ? sectObj.keys : Util.childKeys(sectObj);
    if (sectObj.imgsIdx !== this.nav().imgsIdx) { // Trigger reactive render
      sectObj = Object.assign({}, sectObj);
    }
    sectObj.imgsIdx = this.nav().imgsIdx;
    return sectObj;
  }

  presObject(sectObj, presKey) {
    var pageObj;
    presKey = presKey === 'None' && (sectObj.keys[0] != null) ? sectObj.keys[0] : presKey;
    pageObj = null;
    if (presKey !== 'None' && (sectObj[presKey] != null)) {
      pageObj = sectObj[presKey];
      pageObj.src = sectObj.src;
      pageObj.name = presKey;
      pageObj.peys = sectObj.keys;
      pageObj.keys = pageObj.keys != null ? pageObj.keys : Util.childKeys(pageObj);
      console.log('Mix.pageObj()', {
        dispKey: sectObj.name,
        presKey: presKey,
        pageObj: pageObj
      });
    }
    return pageObj;
  }

  dataObject(sectObj, presKey) {
    var dataObj;
    dataObj = null;
    if (sectObj.type === 'Prac') {
      dataObj = this.pracObject(sectObj.src, sectObj.name);
    } else if (sectObj.type === 'Disp' && presKey !== 'None') {
      dataObj = this.dispObject(sectObj.src, 'None', sectObj.name, presKey);
    }
    return dataObj;
  }

  dispObject(compKey, inovKey, pracKey, dispKey) {
    var disp, prac, pracs;
    disp = {};
    pracs = this.inovObject(compKey, inovKey);
    if (pracs[pracKey] != null) {
      prac = pracs[pracKey];
      if (prac[dispKey] != null) {
        disp = prac[dispKey];
      } else {
        console.error('Mix.dispObject() unknown dispKey', {
          compKey: compKey,
          inovKey: inovKey,
          pracKey: pracKey,
          dispKey: dispKey
        });
      }
    } else {
      console.error('Mix.dispObject() unknown pracKey', {
        compKey: compKey,
        inovKey: inovKey,
        pracKey: pracKey,
        dispKey: dispKey
      });
    }
    return disp;
  }

  flavorJson() {
    if (Mix.Main.Batch.Flavor != null) {
      return Mix.Main.Batch.Flavor.data;
    } else {
      console.error('Mix.flavorJson Flavor.json has not been import into Batch');
      return {};
    }
  }

  getPrac(pracs, row, column, inovKey) {
    var key, prac;
    for (key in pracs) {
      prac = pracs[key];
      if (prac.row === row && prac.column === column) {
        return prac;
      }
    }
    console.error('Mix.getPrac() missing prac for', {
      inovKey: inovKey,
      row: row,
      column: column
    });
    return {};
  }

  isPageKeyComp(pageKey) {
    return pageKey === 'Info' || pageKey === 'Data'; // @app() is 'Muse' and
  }

  
    // Choice
  choice() {
    return Mix.Main.Batch.Choice.data;
  }

  choices(name) {
    var obj;
    obj = this.choice()[name];
    if (obj != null) {
      return obj.choices;
    } else {
      console.error('Mix.choices() bad choice name', {
        name: name
      });
      return [];
    }
  }

  choose(name, choice, checked) {
    var obj;
    obj = this.choice()[name];
    if ((obj != null) && checked) {
      obj.choices.push(choice);
    } else if ((obj != null) && !checked) {
      obj.choices = obj.choices.filter(function(elem) {
        return elem !== choice;
      });
    } else if (obj == null) {
      console.error('Mix.choose() bad choice', {
        name: name,
        choice: choice
      });
    }
  }

  choosen(name, choice) {
    var has;
    has = (this.choice()[name] != null) && this.inArray(choice, this.choices(name));
    // console.log( 'Mix.choosen()', { name:name, choice:choice, has:has, choices:@choices(name) } )
    return has;
  }

  choiceIndex(name, choice) {
    var idx, obj;
    obj = this.choice()[name];
    idx = 0;
    if (obj != null) {
      idx = obj.choices.indexOf(choice);
      idx = idx === -1 ? 0 : idx;
    } else {
      console.error('Mix.choiceIndex() bad choice name', {
        name: name,
        idx: idx
      });
    }
    // console.log( 'Mix.choiceIndex()', { name:name, choice:choice, idx:idx, obj:obj } )
    return idx;
  }

  refreshBtns(name, btns) {
    var btn, key;
    for (key in btns) {
      if (!hasProp.call(btns, key)) continue;
      btn = btns[key];
      btn.checked.value = this.choosen(name, btn.name);
    }
  }

  appendImgsHW(src, elem) {
    var hw, img;
    hw = {};
    img = new Image();
    img.onload = function() {
      hw.iw = this.width;
      hw.ih = this.height;
      hw.ew = elem['clientWidth'];
      hw.eh = elem['clientHeight'];
      hw.r = Math.min(hw.ew / hw.iw, hw.eh / hw.ih);
      img.width = hw.iw * hw.r;
      img.height = hw.ih * hw.r;
      img.alt = 'alt';
      if (elem.children[0] != null) {
        // console.log( 'Mix.appendImgsHW()', hw:hw, { w:img.width, h:img.height } )
        elem.children[0].remove();
      }
      return elem.append(img);
    };
    return img.src = src;
  }

};

// aspectHW:( )
export default Mix;

/*
 * Not Overkill for forcing re-rendering
  signalChange:( obj, change ) ->
    if change
      @count++
      out = {}
      for own key, val of obj
        out[key]  = val
    else
      out = obj
    out
 */
