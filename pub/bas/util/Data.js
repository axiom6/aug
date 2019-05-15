var Data,
  hasProp = {}.hasOwnProperty;

import Util from './Util.js';

Data = class Data {
  // Util.noop( Data.hosted, Data.planeData, Data.refine, Data.asyncJSON )
  static refine(data, type) {
    var akey, area, base, bkey, ckey, comp, disp, dkey, ikey, item, pkey, prac;
    if (type === 'None') {
      return data;
    }
    data.comps = {};
    for (ckey in data) {
      comp = data[ckey];
      if (!(Util.isChild(ckey))) {
        continue;
      }
      // console.log( 'Data.refine comp', comp )
      data.comps[ckey] = comp;
      if (comp['name'] == null) {
        comp['name'] = ckey;
      }
      comp.pracs = {};
      for (pkey in comp) {
        prac = comp[pkey];
        if (!(Util.isChild(pkey))) {
          continue;
        }
        // console.log( '  Data.refine prac', prac )
        comp.pracs[pkey] = prac;
        prac.comp = comp;
        if (prac['name'] == null) {
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
      }
    }
    return data;
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

  static batchJSON(obj, batch, callback, refine = null) {
    var url;
    url = Data.baseUrl() + obj.url;
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      obj['data'] = Util.isFunc(refine) ? refine(data, obj.type) : data;
      if (Data.batchComplete(batch)) {
        return callback(batch);
      }
    }).catch((error) => {
      return console.error("Data.batchJSON()", {
        url: url,
        error: error
      });
    });
  }

  static asyncJSON(url, callback) {
    url = Data.baseUrl() + url;
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

  static baseUrl() {
    if (window.location.href.includes('localhost')) {
      return Data.local;
    } else {
      return Data.hosted;
    }
  }

  // ------ Quick JSON read ------
  static read(url, callback) {
    if (Util.isObj(url)) {
      Data.readFile(url, callback);
    } else {
      Data.asynsJson(url, callback);
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

Data.local = "http://localhost:63342/aug/app/data/";

Data.hosted = "https://ui-48413.firebaseapp.com/";

export default Data;
