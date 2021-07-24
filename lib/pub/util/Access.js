var Access,
  hasProp = {}.hasOwnProperty;

import Util from './Util.js';

Access = class Access {
  static kompsDirs(kompsObj) {
    var i, j, key, komp, komps, ref;
    komps = [];
    for (key in kompsObj) {
      if (!hasProp.call(kompsObj, key)) continue;
      komp = kompsObj[key];
      komps.push(komp);
    }
    for (i = j = 0, ref = komps.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      Access.kompDir(komps, i);
    }
    // for own key,komp of kompsObj
    //   console.log( "Access.kompsDirs", komp )
    return kompsObj;
  }

  static kompDir(komps, i) {
    var next, prev;
    prev = i === 0 ? komps[komps.length - 1] : komps[i - 1];
    next = i === komps.length - 1 ? komps[0] : komps[i + 1];
    komps[i].west = prev.key;
    komps[i].north = prev.key;
    komps[i].prev = prev.key;
    komps[i].east = next.key;
    komps[i].south = next.key;
    komps[i].next = next.key;
  }

  static refine(data) {
    var akey, area, base, bkey, disp, dkey, ikey, item, pkey, prac;
    data.pracs = {};
    for (pkey in data) {
      prac = data[pkey];
      if (!(Util.isChild(pkey))) {
        continue;
      }
      data.pracs[pkey] = prac;
      if (prac['name'] == null) {
        //prac.data        = data
        prac['name'] = pkey;
      }
      prac.disps = {};
      for (dkey in prac) {
        disp = prac[dkey];
        if (!(Util.isChild(dkey))) {
          continue;
        }
        prac.disps[dkey] = disp;
        disp.prac = prac;
        if (disp['name'] == null) {
          disp['name'] = dkey;
        }
        disp.areas = {};
        for (akey in disp) {
          area = disp[akey];
          if (!(Util.isChild(akey))) {
            continue;
          }
          disp.areas[akey] = area;
          area.disp = disp;
          if (area['name'] == null) {
            area['name'] = akey;
          }
          area.items = {};
          for (ikey in area) {
            item = area[ikey];
            if (!(Util.isChild(ikey))) {
              continue;
            }
            area.items[ikey] = item;
            item.area = area;
            if (item['name'] == null) {
              item['name'] = ikey;
            }
            item.bases = {};
            for (bkey in item) {
              base = item[bkey];
              if (!(Util.isChild(bkey))) {
                continue;
              }
              item.bases[bkey] = base;
              base.item = item;
              if (base['name'] == null) {
                base['name'] = bkey;
              }
            }
          }
        }
      }
      prac.dispKeys = Object.keys(prac.disps);
    }
    data.pracKeys = Object.keys(data.pracs);
    return data;
  }

  // Merges principles and innovations into comp practices
  static mergePracs(batch, srcKey, comps) {
    var comp, j, key, len, src, srcs;
    srcs = batch[srcKey].data.pracs;
    for (j = 0, len = comps.length; j < len; j++) {
      comp = comps[j];
      for (key in srcs) {
        if (!hasProp.call(srcs, key)) continue;
        src = srcs[key];
        batch[comp].data.pracs[key] = src;
      }
    }
  }

  // Build a new Innovative Plane
  static buildInnov(batch, innv, comp) {
    var innvs, j, key, len, pracs, ref;
    innvs = batch[innv].data;
    pracs = batch[comp].data;
    ref = ['Team', 'Discover', 'Adapt', 'Benefit', 'Change', 'Govern'];
    for (j = 0, len = ref.length; j < len; j++) {
      key = ref[j];
      innvs[key] = Object.assign({}, pracs[key]);
      innvs[key].plane = innv;
    }
    Access.refine(innvs);
  }

  // ---- Read JSON with batch async
  static batchRead(batch, callback, create = null) {
    var key, obj;
    for (key in batch) {
      if (!hasProp.call(batch, key)) continue;
      obj = batch[key];
      this.batchJSON(obj, batch, callback, create);
    }
  }

  static batchComplete(batch) {
    var key, obj;
    for (key in batch) {
      if (!hasProp.call(batch, key)) continue;
      obj = batch[key];
      if (!obj['data']) {
        return false;
      }
    }
    return true;
  }

  // "Access-Control-Request-Headers": "*", "Access-Control-Request-Method": "*"
  static batchJSON(obj, batch, callback, refine = null) {
    var opt, url;
    url = Access.toUrl(obj.url);
    opt = {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch(url, opt).then((response) => {
      return response.json();
    }).then((data) => {
      obj['data'] = Util.isFunc(refine) ? refine(data) : data;
      if (Access.batchComplete(batch)) {
        return callback(batch);
      }
    }).catch((error) => {
      return console.error("Data.batchJSON()", {
        url: url,
        error: error
      });
    });
  }

  static asyncJSON(urla, callback) {
    var url;
    url = Access.toUrl(urla);
    // console.log( 'Data.asyncJSON()', urla, url )
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      return callback(data);
    }).catch((error) => {
      return console.error("Data.asyncJSON()", {
        url: url,
        error: error
      });
    });
  }

  static planeData(batch, plane) {
    return batch[plane].data[plane];
  }

  static toUrl(url) {
    // console.log( 'Data.toUrl', { url:url, local:Data.local, serve:Data.serve, href:window.location.href })
    if (window.location.href.includes('3000')) {
      return Access.local + url;
    } else if (window.location.href.includes('5000')) {
      return Access.serve + url;
    } else {
      return Access.hosted + url;
    }
  }

  
    // ------ Quick JSON read ------
  static read(url, callback) {
    if (Util.isObj(url)) {
      Access.readFile(url, callback);
    } else {
      Access.asynsJson(url, callback);
    }
  }

  static readFile(fileObj, doJson) {
    var fileReader;
    fileReader = new FileReader();
    fileReader.onerror = function(e) {
      return console.error('Store.readFile', fileObj.name, e.target.error);
    };
    fileReader.onload = function(e) {
      return doJson(JSON.parse(e.target.result));
    };
    fileReader.readAsText(fileObj);
  }

  static saveFile(data, fileName) {
    var downloadLink, htmlBlob, htmlUrl;
    htmlBlob = new Blob([data], {
      type: "text/html;charset=utf-8"
    });
    htmlUrl = window['URL'].createObjectURL(htmlBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = htmlUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

Access.local = "../pub/data/";

Access.serve = "../data/";

Access.hosted = "./data/";

Access.cssDir = 'css/'; // /css in /pub

export default Access;

//# sourceMappingURL=Access.js.map
