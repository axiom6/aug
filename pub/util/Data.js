var Data,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

Data = (function() {
  class Data {
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

  Data.hosted = "https://ui-48413.firebaseapp.com/";

  Data.local = "http://localhost:63342/muse/public/";

  Data.localJSON = "http://localhost:63342/muse/public/json";

  Util.noop(Data.hosted, Data.planeData, Data.refine, Data.asyncJSON);

  Data.Databases = {
    color: {
      id: "color",
      key: "id",
      uriLoc: Data.localJSON + '/color',
      uriWeb: 'https://github.com/axiom6/ui/data/color',
      tables: ['master', 'ncs', 'gray']
    },
    exit: {
      id: "exit",
      key: "_id",
      uriLoc: Data.localJSON + '/exit',
      uriWeb: 'https://github.com/axiom6/ui/data/exit',
      tables: ['ConditionsEast', 'ConditionsWest', 'Deals', 'Forecasts', 'I70Mileposts', 'SegmentsEast', 'SegmentsWest']
    },
    radar: {
      id: "radar",
      key: "name",
      uriLoc: Data.localJSON + '/radar',
      uriWeb: 'https://github.com/axiom6/ui/data/radar',
      tables: ['axiom-techs', 'axiom-quads', 'axiom-techs-schema', 'axiom-quads-schema', 'polyglot-principles']
    },
    sankey: {
      id: "radar",
      uriLoc: Data.localJSON + '/sankey',
      uriWeb: 'https://github.com/axiom6/ui/data/sankey',
      tables: ['energy', 'flare', 'noob', 'plot']
    },
    muse: {
      id: "muse",
      uriLoc: Data.localJSON + '/muse',
      uriWeb: 'https://github.com/axiom6/ui/data/muse',
      tables: ['Columns', 'Rows', 'Practices']
    },
    pivot: {
      id: "pivot",
      uriLoc: Data.localJSON + '/pivot',
      uriWeb: 'https://github.com/axiom6/ui/data/pivot',
      tables: ['mps']
    },
    geo: {
      id: "geo",
      uriLoc: Data.localJSON + '/geo',
      uriWeb: 'https://github.com/axiom6/ui/data/geo',
      tables: ['upperLarimerGeo'],
      schemas: ['GeoJSON']
    },
    f6s: {
      id: "f6s",
      uriLoc: Data.localJSON + '/f6s',
      uriWeb: 'https://github.com/axiom6/ui/data/fs6',
      tables: ['applications', 'followers', 'mentors', 'profile', 'teams']
    }
  };

  return Data;

}).call(this);

export default Data;
